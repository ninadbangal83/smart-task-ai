package com.smarttask.ai.api.controllers;

import com.smarttask.ai.domain.Task;
import com.smarttask.ai.domain.User;
import com.smarttask.ai.domain.services.TaskService;
import com.smarttask.ai.domain.services.SessionService;
import com.smarttask.ai.shared.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3004"}, allowCredentials = "true")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private SessionService sessionService;

    @GetMapping
    public ResponseEntity<?> getTasks(
            @RequestParam(name = "status", required = false) String status,
            @RequestParam(name = "search", required = false) String search,
            HttpServletRequest request) {
        
        String userId = authenticateUser(request);
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Access Denied: Unauthorized"));
        }

        List<Task> tasks = taskService.getTasksForUser(userId, status, search);
        return ResponseEntity.ok(tasks);
    }

    @PostMapping
    public ResponseEntity<?> createTask(@RequestBody Map<String, String> body, HttpServletRequest request) {
        String userId = authenticateUser(request);
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Access Denied: Unauthorized"));
        }

        String title = body.get("title");
        String description = body.get("description");

        if (title == null || title.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Title is required"));
        }

        Task task = taskService.createTask(userId, title, description);
        return ResponseEntity.status(201).body(task);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(
            @PathVariable(name = "id") String id,
            @RequestBody Map<String, String> body,
            HttpServletRequest request) {
        
        String userId = authenticateUser(request);
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Access Denied: Unauthorized"));
        }

        String title = body.get("title");
        String description = body.get("description");
        String status = body.get("status");

        try {
            Task task = taskService.updateTask(id, title, description, status);
            return ResponseEntity.ok(task);
        } catch (Exception e) {
            return ResponseEntity.status(404).body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable(name = "id") String id, HttpServletRequest request) {
        String userId = authenticateUser(request);
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Access Denied: Unauthorized"));
        }

        try {
            taskService.deleteTask(id);
            return ResponseEntity.ok(Map.of("message", "Task deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * Dual-strategy authenticator parsing JWT header or Cookies dynamically!
     */
    private String authenticateUser(HttpServletRequest request) {
        String authStrategy = System.getProperty("AUTH_TYPE", "SESSION");

        if ("JWT".equalsIgnoreCase(authStrategy)) {
            String header = request.getHeader("Authorization");
            if (header != null && header.startsWith("Bearer ")) {
                String token = header.substring(7);
                return JwtUtil.validateTokenAndGetUserId(token);
            }
        } else if ("SESSION".equalsIgnoreCase(authStrategy)) {
            Cookie[] cookies = request.getCookies();
            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    if ("sid".equals(cookie.getName())) {
                        User user = sessionService.getUserFromSession(cookie.getValue());
                        if (user != null) {
                            return user.getId();
                        }
                    }
                }
            }
        }
        return null;
    }
}
