package com.example.demo.service;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.example.demo.model.Url;
import com.example.demo.model.User;
import com.example.demo.repository.UrlRepository;
import com.example.demo.utils.AuthUtils;
import java.time.LocalDateTime;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class UrlServiceTest {

    @Mock
    private UrlRepository urlRepository;

    @Mock
    private AuthUtils authUtils;

    @InjectMocks
    private UrlService urlService;

    @Test
    void toggleUrlStatusFlipsActiveStateForOwner() {
        User owner = User.builder().id(1L).email("user@example.com").build();
        Url url = Url.builder()
            .id(10L)
            .shortCode("j")
            .originalUrl("https://example.com")
            .createdAt(LocalDateTime.now())
            .expiresAt(LocalDateTime.now().plusDays(30))
            .user(owner)
            .isActive(true)
            .build();

        when(authUtils.getCurrentUser()).thenReturn(owner);
        when(urlRepository.findByShortCode("j")).thenReturn(Optional.of(url));
        when(urlRepository.save(url)).thenReturn(url);

        boolean active = urlService.toggleUrlStatus("j");

        assertFalse(active);
        assertFalse(url.isActive());
        verify(urlRepository).save(url);
    }

    @Test
    void toggleUrlStatusRejectsNonOwner() {
        User owner = User.builder().id(1L).email("user@example.com").build();
        User otherUser = User.builder().id(2L).email("other@example.com").build();
        Url url = Url.builder()
            .id(10L)
            .shortCode("j")
            .originalUrl("https://example.com")
            .createdAt(LocalDateTime.now())
            .expiresAt(LocalDateTime.now().plusDays(30))
            .user(owner)
            .isActive(true)
            .build();

        when(authUtils.getCurrentUser()).thenReturn(otherUser);
        when(urlRepository.findByShortCode("j")).thenReturn(Optional.of(url));

        assertThrows(RuntimeException.class, () -> urlService.toggleUrlStatus("j"));
    }

    @Test
    void deleteUrlRemovesUrlForOwner() {
        User owner = User.builder().id(1L).email("user@example.com").build();
        Url url = Url.builder()
            .id(10L)
            .shortCode("j")
            .originalUrl("https://example.com")
            .createdAt(LocalDateTime.now())
            .expiresAt(LocalDateTime.now().plusDays(30))
            .user(owner)
            .isActive(true)
            .build();

        when(authUtils.getCurrentUser()).thenReturn(owner);
        when(urlRepository.findByShortCode("j")).thenReturn(Optional.of(url));

        urlService.deleteUrl("j");

        verify(urlRepository).delete(url);
    }

    @Test
    void deleteUrlRejectsNonOwner() {
        User owner = User.builder().id(1L).email("user@example.com").build();
        User otherUser = User.builder().id(2L).email("other@example.com").build();
        Url url = Url.builder()
            .id(10L)
            .shortCode("j")
            .originalUrl("https://example.com")
            .createdAt(LocalDateTime.now())
            .expiresAt(LocalDateTime.now().plusDays(30))
            .user(owner)
            .isActive(true)
            .build();

        when(authUtils.getCurrentUser()).thenReturn(otherUser);
        when(urlRepository.findByShortCode("j")).thenReturn(Optional.of(url));

        assertThrows(RuntimeException.class, () -> urlService.deleteUrl("j"));
    }
}
