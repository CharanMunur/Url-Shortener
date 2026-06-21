package com.example.demo.service;

import com.example.demo.dto.ClickDetailDTO;
import com.example.demo.dto.UrlAnalyticsResponse;
import com.example.demo.dto.UrlRequest;
import com.example.demo.dto.UrlResponse;
import com.example.demo.model.Click;
import com.example.demo.model.Url;
import com.example.demo.model.User;
import com.example.demo.repository.ClickRepository;
import com.example.demo.repository.UrlRepository;
import com.example.demo.utils.AuthUtils;
import com.example.demo.utils.Base62Encoder;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua_parser.Client;
import ua_parser.Parser;

@Service
public class UrlService {

    private static final Parser USER_AGENT_PARSER = new Parser();

    private final UrlRepository urlRepository;
    private final ClickRepository clickRepository;
    private final StringRedisTemplate redisTemplate;
    private final AuthUtils authUtils;

    public UrlService(
        UrlRepository urlRepository,
        AuthUtils authUtils,
        ClickRepository clickRepository,
        StringRedisTemplate redisTemplate
    ) {
        this.urlRepository = urlRepository;
        this.authUtils = authUtils;
        this.clickRepository = clickRepository;
        this.redisTemplate = redisTemplate;
    }

    @Transactional
    public UrlResponse shortenUrl(UrlRequest request) {
        User user = authUtils.getCurrentUser();

        long count = urlRepository.countByUser(user);

        if (count >= 25) {
            throw new RuntimeException("You have reached the maximum number of URLs");
        }

        String originalUrl = request.getOriginalUrl();

        Url url = Url.builder()
            .originalUrl(originalUrl)
            .user(user)
            .createdAt(LocalDateTime.now())
            .expiresAt(LocalDateTime.now().plusDays(30))
            .build();

        Url saved = urlRepository.save(url);

        Long id = saved.getId();
        String shortCode = Base62Encoder.encode(id);

        saved.setShortCode(shortCode);

        urlRepository.save(saved);

        return new UrlResponse(shortCode, 0, saved.isActive(), saved.getExpiresAt());
    }

    public String redirectUrl(String shortCode, String ipAddress, String userAgent) {
        String cacheKey = "url:" + shortCode;
        String cachedUrl = redisTemplate.opsForValue().get(cacheKey);

        String originalUrl;
        Long urlId;

        if (cachedUrl != null) {
            originalUrl = cachedUrl;
            urlId = urlRepository
                .findIdByShortCode(shortCode)
                .orElseThrow(() -> new RuntimeException("Short code not found"));
        } else {
            Url url = urlRepository
                .findByShortCode(shortCode)
                .orElseThrow(() -> new RuntimeException("Short code not found"));

            if (!url.isActive()) {
                throw new RuntimeException("This link is disabled");
            }
            if (url.getExpiresAt().isBefore(LocalDateTime.now())) {
                throw new RuntimeException("This link has expired");
            }

            originalUrl = url.getOriginalUrl();
            urlId = url.getId();

            redisTemplate.opsForValue().set(cacheKey, originalUrl, Duration.ofHours(24));
        }

        Click click = Click.builder()
            .url(urlRepository.getReferenceById(urlId))
            .clickedAt(LocalDateTime.now())
            .ipAddress(ipAddress)
            .userAgent(userAgent)
            .build();

        clickRepository.save(click);

        return originalUrl;
    }

    public List<UrlResponse> getUserUrls() {
        User user = authUtils.getCurrentUser();

        List<Url> urls = urlRepository.findByUser(user);

        return urls
            .stream()
            .map(url ->
                new UrlResponse(
                    "http://localhost:8080/" + url.getShortCode(),
                    clickRepository.countByUrl(url),
                    url.isActive(),
                    url.getExpiresAt()
                )
            )
            .toList();
    }

    public boolean toggleUrlStatus(String shortCode) {
        User user = authUtils.getCurrentUser();

        Url url = urlRepository
            .findByShortCode(shortCode)
            .orElseThrow(() -> new RuntimeException("Short code not found"));

        if (!url.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You dont own this url");
        }

        url.setActive(!url.isActive());
        urlRepository.save(url);
        redisTemplate.delete("url:" + shortCode);

        return url.isActive();
    }

    @Transactional
    public void deleteUrl(String shortCode) {
        User user = authUtils.getCurrentUser();

        Url url = urlRepository
            .findByShortCode(shortCode)
            .orElseThrow(() -> new RuntimeException("Short code not found"));

        if (!url.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You dont own this url");
        }

        clickRepository.deleteByUrl(url);
        urlRepository.delete(url);
        redisTemplate.delete("url:" + shortCode);
    }

    public UrlAnalyticsResponse getUrlAnalytics(String shortCode) {
        User user = authUtils.getCurrentUser();

        Url url = urlRepository
            .findByShortCode(shortCode)
            .orElseThrow(() -> new RuntimeException("Short code not found"));

        if (!url.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You dont own this url");
        }

        List<Click> clicks = clickRepository.findByUrl(url);

        Map<String, Long> browserBreakdown = clicks
            .stream()
            .map(click -> extractBrowser(click.getUserAgent()))
            .collect(Collectors.groupingBy(browser -> browser, Collectors.counting()));

        Map<String, Long> osBreakdown = clicks
            .stream()
            .map(click -> extractOperatingSystem(click.getUserAgent()))
            .collect(Collectors.groupingBy(os -> os, Collectors.counting()));

        Map<String, Long> clicksByDate = clicks
            .stream()
            .collect(
                Collectors.groupingBy(
                    click -> click.getClickedAt().toLocalDate().toString(),
                    Collectors.counting()
                )
            );

        List<ClickDetailDTO> lastClicks = clicks
            .stream()
            .sorted(Comparator.comparing(Click::getClickedAt).reversed())
            .limit(5)
            .map(click ->
                ClickDetailDTO.builder()
                    .clickedAt(click.getClickedAt())
                    .ipAddress(click.getIpAddress())
                    .userAgent(click.getUserAgent())
                    .build()
            )
            .toList();

        return UrlAnalyticsResponse.builder()
            .shortCode(url.getShortCode())
            .originalUrl(url.getOriginalUrl())
            .totalClicks(clicks.size())
            .lastClicks(lastClicks)
            .browserBreakdown(browserBreakdown)
            .osBreakdown(osBreakdown)
            .clicksByDate(clicksByDate)
            .build();
    }

    private String extractBrowser(String userAgent) {
        Client client = USER_AGENT_PARSER.parse(userAgent);
        if (client == null || client.userAgent == null || client.userAgent.family == null) {
            return "Unknown";
        }
        return client.userAgent.family != null ? client.userAgent.family : "Unknown";
    }

    private String extractOperatingSystem(String userAgent) {
        Client client = USER_AGENT_PARSER.parse(userAgent);
        if (client == null || client.os == null || client.os.family == null) {
            return "Unknown";
        }
        return client.os.family != null ? client.os.family : "Unknown";
    }
}
