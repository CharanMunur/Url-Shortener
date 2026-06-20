package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

import ua_parser.Client;
import ua_parser.Parser;

@Service
public class UrlService {

    private static final Parser USER_AGENT_PARSER = new Parser();

    private final UrlRepository urlRepository;
    private final ClickRepository clickRepository;
    private final AuthUtils authUtils;

    public UrlService(UrlRepository urlRepository, AuthUtils authUtils, ClickRepository clickRepository) {
        this.urlRepository = urlRepository;
        this.authUtils = authUtils;
        this.clickRepository = clickRepository;
    }

    @Transactional
    public UrlResponse shortenUrl(UrlRequest request) {
        User user = authUtils.getCurrentUser();
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

        String shortUrl = "http://localhost:8080/" + shortCode;
        return new UrlResponse(shortUrl, saved.isActive(), saved.getExpiresAt());
    }

    public String redirectUrl(String shortCode, String ipAddress, String userAgent) {
        Url url = urlRepository
                .findByShortCode(shortCode)
                .orElseThrow(() -> new RuntimeException("Short code not found"));

        if (!url.isActive()) {
            throw new RuntimeException("This link is disabled");
        }

        if (url.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("This link has expired");
        }

        Click click = Click.builder()
                .url(url)
                .clickedAt(LocalDateTime.now())
                .ipAddress(ipAddress)
                .userAgent(userAgent)
                .build();

        clickRepository.save(click);

        return url.getOriginalUrl();
    }

    public List<UrlResponse> getUserUrls() {
        User user = authUtils.getCurrentUser();
        List<Url> urls = urlRepository.findByUser(user);

        return urls.stream()
                .map(url -> new UrlResponse("http://localhost:8080/" + url.getShortCode(), url.isActive(),
                        url.getExpiresAt()))
                .toList();
    }

    public boolean toggleUrlStatus(String shortCode) {
        User user = authUtils.getCurrentUser();

        Url url = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new RuntimeException("Short code not found"));

        if (!url.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You dont own this url");
        }

        url.setActive(!url.isActive());
        urlRepository.save(url);

        return url.isActive();
    }

    public void deleteUrl(String shortCode) {
        User user = authUtils.getCurrentUser();

        Url url = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new RuntimeException("Short code not found"));

        if (!url.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You dont own this url");
        }
        urlRepository.delete(url);
    }

    public UrlAnalyticsResponse getUrlAnalytics(String shortCode) {
        User user = authUtils.getCurrentUser();

        Url url = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new RuntimeException("Short code not found"));

        if (!url.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You dont own this url");
        }

        List<Click> clicks = clickRepository.findByUrl(url);

        Map<String, Long> browserBreakdown = clicks.stream()
                .map(click -> extractBrowser(click.getUserAgent()))
                .collect(Collectors.groupingBy(browser -> browser, Collectors.counting()));

        Map<String, Long> osBreakdown = clicks.stream()
                .map(click -> extractOperatingSystem(click.getUserAgent()))
                .collect(Collectors.groupingBy(os -> os, Collectors.counting()));

        List<ClickDetailDTO> lastClicks = clicks.stream()
            .sorted(Comparator.comparing(Click::getClickedAt).reversed())
            .limit(5)
            .map(click -> ClickDetailDTO.builder()
                    .clickedAt(click.getClickedAt())
                    .ipAddress(click.getIpAddress())
                    .userAgent(click.getUserAgent())
                    .build())
            .toList();

        return UrlAnalyticsResponse.builder()
                .shortCode(url.getShortCode())
                .originalUrl(url.getOriginalUrl())
                .totalClicks(clicks.size())
                .lastClicks(lastClicks)
                .browserBreakdown(browserBreakdown)
                .osBreakdown(osBreakdown)
                .build();
    }

    private String extractBrowser(String userAgent) {
        Client client = USER_AGENT_PARSER.parse(userAgent);
        if (client == null || client.userAgent == null || client.userAgent.family == null) {
            return "Unknown";
        }
        return client.userAgent.family;
    }

    private String extractOperatingSystem(String userAgent) {
        Client client = USER_AGENT_PARSER.parse(userAgent);
        if (client == null || client.os == null || client.os.family == null) {
            return "Unknown";
        }
        return client.os.family;
    }
}
