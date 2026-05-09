package com.smarttask.ai.api.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class HealthController {

    @GetMapping("/health")
    public Map<String, Object> getHealth() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", Instant.now().toString());
        response.put("database", System.getProperty("DB_TYPE", "MONGO"));
        response.put("broker", System.getProperty("BROKER_TYPE", "RABBITMQ"));
        response.put("mode", System.getProperty("NODE_ENV", "development"));
        response.put("authStrategy", System.getProperty("AUTH_TYPE", "SESSION"));
        return response;
    }
}
