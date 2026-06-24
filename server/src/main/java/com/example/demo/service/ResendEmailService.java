package com.example.demo.service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class ResendEmailService {

    @Value("${resend.api-key}")
    private String apiKey;

    @Value("${resend.from}")
    private String from;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    /**
     * Sends a plain-text email via the Resend API.
     *
     * @param to      recipient email address
     * @param subject email subject line
     * @param text    plain-text body
     */
    public void sendEmail(String to, String subject, String text) {
        // Escape quotes/backslashes in user-supplied strings for safe JSON embedding
        String safeTo      = escape(to);
        String safeFrom    = escape(from);
        String safeSubject = escape(subject);
        String safeText    = escape(text);

        String body = String.format(
            "{\"from\":\"%s\",\"to\":[\"%s\"],\"subject\":\"%s\",\"text\":\"%s\"}",
            safeFrom, safeTo, safeSubject, safeText
        );

        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("https://api.resend.com/emails"))
            .header("Authorization", "Bearer " + apiKey)
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(body))
            .build();

        try {
            HttpResponse<String> response =
                httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                System.err.println("Resend API error " + response.statusCode() + ": " + response.body());
            }
        } catch (Exception e) {
            System.err.println("Failed to send email via Resend: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /** Minimal JSON string escaping. */
    private static String escape(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }
}
