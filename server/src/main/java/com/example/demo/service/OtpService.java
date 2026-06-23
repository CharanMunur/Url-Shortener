package com.example.demo.service;

import com.example.demo.dto.AuthResponse;
import com.example.demo.dto.LoginRequest;
import com.example.demo.model.Otp;
import com.example.demo.model.OtpPurpose;
import com.example.demo.model.User;
import com.example.demo.repository.OtpRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtUtils;
import java.time.LocalDateTime;
import java.util.Random;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
public class OtpService {

    private final OtpRepository otpRepository;
    private final JwtUtils jwtUtils;
    private final JavaMailSender javaMailSender;
    private final UserDetailsService userDetailsService;
    private final UserRepository userRepository;

    public OtpService(
        OtpRepository otpRepository,
        JavaMailSender javaMailSender,
        JwtUtils jwtUtils,
        UserDetailsService userDetailsService,
        UserRepository userRepository
    ) {
        this.otpRepository = otpRepository;
        this.javaMailSender = javaMailSender;
        this.jwtUtils = jwtUtils;
        this.userDetailsService = userDetailsService;
        this.userRepository = userRepository;
    }

    public void sendOtp(User user, OtpPurpose purpose) {
        // Delete any existing unused OTPs for this user+purpose
        otpRepository.deleteByUserAndPurpose(user, purpose);

        // Generate 6-digit OTP
        String code = String.format("%06d", new Random().nextInt(999999));

        Otp otp = Otp.builder()
            .user(user)
            .purpose(purpose)
            .otpCode(code)
            .createdAt(LocalDateTime.now())
            .expiresAt(
                LocalDateTime.now().plusMinutes(purpose == OtpPurpose.EMAIL_VERIFICATION ? 5 : 15)
            )
            .build();

        otpRepository.save(otp);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject(
            purpose == OtpPurpose.EMAIL_VERIFICATION ? "Verify your email" : "Reset your password"
        );
        message.setText(
            "Your OTP is: " +
                code +
                "\nIt expires in " +
                (purpose == OtpPurpose.EMAIL_VERIFICATION ? "5" : "15") +
                " minutes."
        );
        try {
            javaMailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send OTP email: " + e.getMessage());
            e.printStackTrace();
        }
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
