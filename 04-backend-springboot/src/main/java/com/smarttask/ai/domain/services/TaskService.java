package com.smarttask.ai.domain.services;

import com.smarttask.ai.domain.Task;
import com.smarttask.ai.infrastructure.repositories.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    public List<Task> getTasksForUser(String userId, String status, String search) {
        List<Task> tasks = taskRepository.findByUserId(userId);

        if (status != null && !status.trim().isEmpty() && !"all".equalsIgnoreCase(status)) {
            tasks = tasks.stream()
                    .filter(t -> status.equalsIgnoreCase(t.getStatus()))
                    .collect(Collectors.toList());
        }

        if (search != null && !search.trim().isEmpty()) {
            String q = search.toLowerCase();
            tasks = tasks.stream()
                    .filter(t -> t.getTitle().toLowerCase().contains(q) || t.getDescription().toLowerCase().contains(q))
                    .collect(Collectors.toList());
        }

        return tasks;
    }

    public Task createTask(String userId, String title, String description) {
        Task task = Task.builder()
                .title(title)
                .description(description)
                .status("pending")
                .userId(userId)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        return taskRepository.save(task);
    }

    public Task updateTask(String taskId, String title, String description, String status) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (title != null) task.setTitle(title);
        if (description != null) task.setDescription(description);
        if (status != null) task.setStatus(status);
        task.setUpdatedAt(Instant.now());

        return taskRepository.save(task);
    }

    public void deleteTask(String taskId) {
        if (!taskRepository.existsById(taskId)) {
            throw new RuntimeException("Task not found");
        }
        taskRepository.deleteById(taskId);
    }
}
