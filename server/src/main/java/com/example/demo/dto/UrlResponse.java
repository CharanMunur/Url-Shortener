package com.example.demo.dto;

import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@AllArgsConstructor
public class UrlResponse {
    @Getter
    private String shortCode;
    
    @Getter
    private long totalClicks;
    
    @Getter(onMethod_ = {@JsonProperty("isActive")})
    private boolean isActive;
    
    @Getter
    private LocalDateTime expiresAt;
}
