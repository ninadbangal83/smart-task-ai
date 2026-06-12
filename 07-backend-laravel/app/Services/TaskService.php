<?php

namespace App\Services;

use App\Models\Task;
use App\Models\User;
use App\Repositories\Contracts\TaskRepositoryInterface;
use App\Services\Broker\BrokerInterface;
use App\Exceptions\NotFoundException;
use App\Exceptions\ForbiddenException;
use App\Exceptions\BadRequestException;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

/**
 * Task Service — Business Logic Layer.
 * 
 * ✅ CORRECT Laravel pattern:
 *   - Dependencies injected via constructor (not static factories)
 *   - Laravel's Cache facade instead of raw Redis (config-driven)
 *   - Laravel's Log facade instead of custom logger factory
 *   - Returns Eloquent Models (Laravel idiom), not DTOs
 * 
 * The IoC container resolves TaskRepositoryInterface and BrokerInterface
 * automatically based on AppServiceProvider bindings.
 */
class TaskService
{
    public function __construct(
        private readonly TaskRepositoryInterface $taskRepository,
        private readonly BrokerInterface         $broker,
    ) {}

    public function createTask(string $title, string $userId, ?string $description = null): Task
    {
        // 1. Validate business rule
        if (strlen($title) < 3) {
            throw new BadRequestException('Title must be at least 3 characters long');
        }

        // 2. Create via repository (never call Task::create() directly in service)
        $task = $this->taskRepository->create([
            'id'          => Str::uuid()->toString(),
            'user_id'     => $userId,
            'title'       => $title,
            'description' => $description,
            'status'      => 'pending',
        ]);

        Log::info("📝 New Task created in DB: {$task->id} for user {$userId}");

        // 3. Cache the result (Cache-Aside pattern — Laravel Cache facade)
        Cache::put("task:{$task->id}", $task->toArray(), now()->addHour());

        // 4. Notify AI Worker via broker
        $this->broker->publish('task_processing', [
            'taskId' => $task->id,
            'userId' => $userId,
            'action' => 'analyze_priority',
        ]);
        Log::debug("📤 Task {$task->id} queued for AI analysis");

        return $task;
    }

    public function getTaskById(string $id, User $requester): Task
    {
        // Cache-Aside: Check Laravel Cache first
        $cached = Cache::get("task:{$id}");
        if ($cached && ($cached['user_id'] === $requester->id || $requester->isAdmin())) {
            Log::debug("⚡ Cache HIT for task:{$id}");
            // Hydrate a Model from cache (avoid extra DB query)
            return (new Task())->forceFill($cached);
        }

        Log::debug("💾 Cache MISS for task:{$id}. Fetching from DB.");
        $task = $this->taskRepository->findById(
            id:     $id,
            userId: $requester->isAdmin() ? null : $requester->id
        );

        if (!$task) {
            throw new NotFoundException('Task not found or unauthorized');
        }

        Cache::put("task:{$id}", $task->toArray(), now()->addHour());
        return $task;
    }

    public function getAllTasks(User $requester, ?string $targetUserId = null): Collection
    {
        // Admin can see everyone's or a target user's tasks; User sees only their own
        $userId = $requester->isAdmin() ? $targetUserId : $requester->id;
        return $this->taskRepository->findAll($userId);
    }

    public function updateTask(string $id, User $requester, array $data): Task
    {
        $task = $this->taskRepository->findById($id);
        if (!$task) throw new NotFoundException('Task not found');

        // Authorization check — user can only update their own tasks
        if (!$requester->owns($task) && !$requester->isAdmin()) {
            throw new ForbiddenException('You do not have permission to update this task');
        }

        // Validate title length if title is being updated
        if (isset($data['title']) && strlen($data['title']) < 3) {
            throw new BadRequestException('Title must be at least 3 characters long');
        }

        $updated = $this->taskRepository->update($id, $data);
        Cache::put("task:{$id}", $updated->toArray(), now()->addHour());

        Log::info("✏️ Task updated: {$id} by {$requester->id}");
        return $updated;
    }

    public function deleteTask(string $id, User $requester): void
    {
        $task = $this->taskRepository->findById($id);

        // FIX from code review: throw 404 instead of silent return
        if (!$task) throw new NotFoundException('Task not found');

        // Authorization check
        if (!$requester->owns($task) && !$requester->isAdmin()) {
            throw new ForbiddenException('You do not have permission to delete this task');
        }

        // Domain Guard: Cannot delete completed tasks (via Model method)
        if (!$task->canBeDeleted()) {
            throw new BadRequestException('Cannot delete a completed task');
        }

        $this->taskRepository->delete($id);
        Cache::forget("task:{$id}");
        Log::info("🗑️ Task deleted: {$id} by {$requester->id}");
    }
}
