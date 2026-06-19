package com.example.demo.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UrlResponse {
    private String shortUrl;
    private boolean isActive;
    private LocalDateTime expiresAt;
}
