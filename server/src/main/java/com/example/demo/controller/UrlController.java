package com.example.demo.controller;

import java.net.URI;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.UrlAnalyticsResponse;
import com.example.demo.dto.UrlRequest;
import com.example.demo.dto.UrlResponse;
import com.example.demo.service.UrlService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
public class UrlController {

    private final UrlService urlService;

    public UrlController(UrlService urlService) {
        this.urlService = urlService;
    }

    @PostMapping("/shorten")
    public UrlResponse shorten(@RequestBody UrlRequest originalUrl) {
        return urlService.shortenUrl(originalUrl);
    }

    @GetMapping("/{shortCode}")
    public ResponseEntity<Void> redirect(@PathVariable String shortCode, HttpServletRequest request) {
        String ipAddress = request.getRemoteAddr();
        String userAgent = request.getHeader("User-Agent");
        String originalUrl = urlService.redirectUrl(shortCode, ipAddress, userAgent);
        
        return ResponseEntity.status(302).location(URI.create(originalUrl)).build();
    }

    @GetMapping("/urls")
    public List<UrlResponse> getUserUrls() {
        return urlService.getUserUrls();
    }

    @PatchMapping("/urls/{shortCode}/toggle")
    public boolean toggleUrl(@PathVariable String shortCode) {
        return urlService.toggleUrlStatus(shortCode);
    }

    @DeleteMapping("/urls/{shortCode}")
    public ResponseEntity<Void> deleteUrl(@PathVariable String shortCode) {
        urlService.deleteUrl(shortCode);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @GetMapping("/urls/{shortCode}/analytics")
    public ResponseEntity<UrlAnalyticsResponse> getUrlAnalytics(@PathVariable String shortCode) {
        return ResponseEntity.ok(urlService.getUrlAnalytics(shortCode));
    }
}
