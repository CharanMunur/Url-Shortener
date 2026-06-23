package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResetPasswordRequest {
    private String email;
    private String otpCode;
    private String newPassword;
}
