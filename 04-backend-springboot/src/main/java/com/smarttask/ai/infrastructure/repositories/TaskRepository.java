package com.smarttask.ai.infrastructure.repositories;

import com.smarttask.ai.domain.Task;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TaskRepository extends MongoRepository<Task, String> {
    List<Task> findByUserId(String userId);
}
