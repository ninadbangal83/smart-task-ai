package com.smarttask.ai.domain.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smarttask.ai.domain.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Service
public class SessionService {

    @Autowired(required = false)
    private StringRedisTemplate redisTemplate;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final ConcurrentHashMap<String, User> fallbackStore = new ConcurrentHashMap<>();

    public void saveSession(String sessionId, User user) {
        try {
            if (redisTemplate != null) {
                String userJson = objectMapper.writeValueAsString(user);
                redisTemplate.opsForValue().set("session:" + sessionId, userJson, 24, TimeUnit.HOURS);
                return;
            }
        } catch (Exception e) {
            System.err.println("⚠️ Redis save session failed, falling back to in-memory: " + e.getMessage());
        }
        fallbackStore.put(sessionId, user);
    }

    public User getUserFromSession(String sessionId) {
        try {
            if (redisTemplate != null) {
                String userJson = redisTemplate.opsForValue().get("session:" + sessionId);
                if (userJson != null) {
                    return objectMapper.readValue(userJson, User.class);
                }
            }
        } catch (Exception e) {
            System.err.println("⚠️ Redis load session failed, falling back to in-memory: " + e.getMessage());
        }
        return fallbackStore.get(sessionId);
    }

    public void deleteSession(String sessionId) {
        try {
            if (redisTemplate != null) {
                redisTemplate.delete("session:" + sessionId);
            }
        } catch (Exception e) {
            System.err.println("⚠️ Redis delete session failed: " + e.getMessage());
        }
        fallbackStore.remove(sessionId);
    }
}
