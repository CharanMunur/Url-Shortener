package com.example.demo.service;

import com.example.demo.dto.AuthResponse;
import com.example.demo.model.Otp;
import com.example.demo.model.OtpPurpose;
import com.example.demo.model.User;
import com.example.demo.repository.OtpRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtUtils;
import java.time.LocalDateTime;
import java.util.Random;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
public class OtpService {

    private final OtpRepository otpRepository;
    private final JwtUtils jwtUtils;
    private final ResendEmailService resendEmailService;
    private final UserDetailsService userDetailsService;
    private final UserRepository userRepository;

    public OtpService(
        OtpRepository otpRepository,
        ResendEmailService resendEmailService,
        JwtUtils jwtUtils,
        UserDetailsService userDetailsService,
        UserRepository userRepository
    ) {
        this.otpRepository = otpRepository;
        this.resendEmailService = resendEmailService;
        this.jwtUtils = jwtUtils;
        this.userDetailsService = userDetailsService;
        this.userRepository = userRepository;
    }

    public void sendOtp(User user, OtpPurpose purpose) {
        // Delete any existing unused OTPs for this user+purpose
        otpRepository.deleteByUserAndPurpose(user, purpose);

        // Generate 6-digit OTP
        String code = String.format("%06d", new Random().nextInt(999999));

        int expiryMinutes = purpose == OtpPurpose.EMAIL_VERIFICATION ? 5 : 15;

        Otp otp = Otp.builder()
            .user(user)
            .purpose(purpose)
            .otpCode(code)
            .createdAt(LocalDateTime.now())
            .expiresAt(LocalDateTime.now().plusMinutes(expiryMinutes))
            .build();

        otpRepository.save(otp);

        String subject = purpose == OtpPurpose.EMAIL_VERIFICATION
            ? "Verify your email — Shrtn"
            : "Reset your password — Shrtn";

        String body = "Your OTP is: " + code + "\nIt expires in " + expiryMinutes + " minutes.";

        resendEmailService.sendEmail(user.getEmail(), subject, body);
    }

    public AuthResponse verifyOtp(User user, OtpPurpose purpose, String code) {
        Otp otp = otpRepository
            .findByUserAndPurposeAndUsedAtIsNull(user, purpose)
            .orElseThrow(() -> new RuntimeException("OTP not found"));

        if (otp.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP has expired");
        }

        if (!otp.getOtpCode().equals(code)) {
            throw new RuntimeException("Invalid OTP");
        }

        otp.setUsedAt(LocalDateTime.now());
        otpRepository.save(otp);
        user.setEmailVerified(true);
        userRepository.save(user);

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtils.generateToken(userDetails);
        return AuthResponse.builder().token(token).build();
    }

    public void validateOtp(User user, OtpPurpose purpose, String code) {
        Otp otp = otpRepository
            .findByUserAndPurposeAndUsedAtIsNull(user, purpose)
            .orElseThrow(() -> new RuntimeException("OTP not found"));

        if (otp.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP has expired");
        }

        if (!otp.getOtpCode().equals(code)) {
            throw new RuntimeException("Invalid OTP");
        }

        otp.setUsedAt(LocalDateTime.now());
        otpRepository.save(otp);
    }
}
