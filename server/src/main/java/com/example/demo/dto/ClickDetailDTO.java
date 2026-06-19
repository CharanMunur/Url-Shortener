package com.example.demo.dto;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ClickDetailDTO {
    private LocalDateTime clickedAt;
    private String ipAddress;
    private String userAgent;
}
