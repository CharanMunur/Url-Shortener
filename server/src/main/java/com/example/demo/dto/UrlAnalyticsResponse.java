package com.example.demo.dto;

import java.util.List;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class UrlAnalyticsResponse {
    private String shortCode;
    private String originalUrl;
    private long totalClicks;
    private List<ClickDetailDTO> lastClicks;
}
