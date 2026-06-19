package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.UrlRequest;
import com.example.demo.dto.UrlResponse;
import com.example.demo.model.Url;
import com.example.demo.model.User;
import com.example.demo.repository.UrlRepository;
import com.example.demo.utils.AuthUtils;
import com.example.demo.utils.Base62Encoder;

@Service
public class UrlService {

    private final UrlRepository urlRepository;
    private final AuthUtils authUtils;

    public UrlService(UrlRepository urlRepository, AuthUtils authUtils) {
        this.urlRepository = urlRepository;
        this.authUtils = authUtils;
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

    public String redirectUrl(String shortCode) {
        Url url = urlRepository
                .findByShortCode(shortCode)
                .orElseThrow(() -> new RuntimeException("Short code not found"));

        if (!url.isActive()) {
            throw new RuntimeException("This link is disabled");
        }

        if (url.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("This link has expired");
        }

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
}
