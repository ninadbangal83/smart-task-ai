package com.smarttask.ai.domain.services;

import com.smarttask.ai.domain.User;
import com.smarttask.ai.infrastructure.repositories.UserRepository;
import com.smarttask.ai.shared.utils.HashUtil;
import com.smarttask.ai.shared.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public Map<String, Object> register(String name, String email, String password) {
        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            throw new RuntimeException("User already exists");
        }

        String hashedPassword = HashUtil.hashPassword(password);
        
        // First user is Admin
        long count = userRepository.count();
        String role = count == 0 ? "admin" : "user";

        User user = User.builder()
                .name(name)
                .email(email)
                .password(hashedPassword)
                .role(role)
                .build();

        user = userRepository.save(user);

        Map<String, Object> result = new HashMap<>();
        result.put("user", user);

        String authStrategy = System.getProperty("AUTH_TYPE", "JWT");
        if ("JWT".equalsIgnoreCase(authStrategy)) {
            String token = JwtUtil.generateToken(user.getId(), user.getEmail());
            result.put("token", token);
        }

        return result;
    }

    public Map<String, Object> login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!HashUtil.comparePassword(password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        Map<String, Object> result = new HashMap<>();
        result.put("user", user);

        String authStrategy = System.getProperty("AUTH_TYPE", "JWT");
        if ("JWT".equalsIgnoreCase(authStrategy)) {
            String token = JwtUtil.generateToken(user.getId(), user.getEmail());
            result.put("token", token);
        }

        return result;
    }
}
