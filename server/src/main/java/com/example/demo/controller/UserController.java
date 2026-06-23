package com.example.demo.controller;

import com.example.demo.dto.ChangePasswordRequest;
import com.example.demo.dto.MessageResponse;
import com.example.demo.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final AuthService authService;

    @PostMapping("/change-password")
    public ResponseEntity<MessageResponse> changePassword(@RequestBody ChangePasswordRequest request) {
        return ResponseEntity.ok(authService.changePassword(request));
    }
}
