package com.example.demo.service;

import com.example.demo.dto.UrlRequest;
import com.example.demo.dto.UrlResponse;
import com.example.demo.model.Url;
import com.example.demo.repository.UrlRepository;
import com.example.demo.utils.Base62Encoder;
import java.time.LocalDateTime;
import org.springframework.stereotype.Service;

@Service
public class UrlService {

    private final UrlRepository urlRepository;

    public UrlService(UrlRepository urlRepository) {
        this.urlRepository = urlRepository;
    }

    public UrlResponse shortenUrl(UrlRequest request) {
        String originalUrl = request.getOriginalUrl();

        Url url = Url.builder().originalUrl(originalUrl).createdAt(LocalDateTime.now()).build();

        Url saved = urlRepository.save(url);

        Long id = saved.getId();
        String shortCode = Base62Encoder.encode(id);

        saved.setShortCode(shortCode);

        urlRepository.save(saved);

        String shortUrl = "http://localhost:8080/" + shortCode;
        return new UrlResponse(shortUrl);
    }

    public String redirectUrl(String shortCode) {
        Url url  = urlRepository.findByShortCode(shortCode).orElseThrow(() -> new RuntimeException("Short code not found"));
        return url.getOriginalUrl();
    }
}
