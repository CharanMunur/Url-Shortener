package com.example.demo.repository;

import com.example.demo.model.Otp;
import com.example.demo.model.OtpPurpose;
import com.example.demo.model.User;

import jakarta.transaction.Transactional;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

public interface OtpRepository extends JpaRepository<Otp, Long> {
    Optional<Otp> findByUserAndPurposeAndUsedAtIsNull(User user, OtpPurpose purpose);
    @Modifying
    @Transactional
    void deleteByUserAndPurpose(User user, OtpPurpose purpose);
}