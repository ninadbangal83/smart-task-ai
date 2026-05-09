package com.smarttask.ai.api.controllers;

import com.smarttask.ai.domain.User;
import com.smarttask.ai.domain.services.AuthService;
import com.smarttask.ai.domain.services.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private SessionService sessionService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body, HttpServletResponse response) {
        try {
            String name = body.get("name");
            String email = body.get("email");
            String password = body.get("password");

            if (name == null || email == null || password == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "Name, email, and password are required"));
            }

            Map<String, Object> result = authService.register(name, email, password);
            handleSessionIfEnabled(result, response);

            return ResponseEntity.status(201).body(result);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body, HttpServletResponse response) {
        try {
            String email = body.get("email");
            String password = body.get("password");

            if (email == null || password == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "Email and password are required"));
            }

            Map<String, Object> result = authService.login(email, password);
            handleSessionIfEnabled(result, response);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("sid".equals(cookie.getName())) {
                    sessionService.deleteSession(cookie.getValue());
                }
            }
        }
        Cookie cookie = new Cookie("sid", "");
        cookie.setPath("/");
        cookie.setMaxAge(0);
        cookie.setHttpOnly(true);
        response.addCookie(cookie);

        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    private void handleSessionIfEnabled(Map<String, Object> result, HttpServletResponse response) {
        String authStrategy = System.getProperty("AUTH_TYPE", "SESSION");
        if ("SESSION".equalsIgnoreCase(authStrategy)) {
            User user = (User) result.get("user");
            String sessionId = UUID.randomUUID().toString();
            sessionService.saveSession(sessionId, user);

            Cookie cookie = new Cookie("sid", sessionId);
            cookie.setPath("/");
            cookie.setMaxAge(86400); // 1 day
            cookie.setHttpOnly(true);
            response.addCookie(cookie);

            result.put("session", "active");
        }
    }
}
