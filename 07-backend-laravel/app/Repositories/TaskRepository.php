<?php

namespace App\Repositories;

use App\Models\Task;
use App\Repositories\Contracts\TaskRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;

/**
 * Task Repository — Eloquent implementation of TaskRepositoryInterface.
 * 
 * Lives in app/Repositories/ — concrete implementation.
 * Bound to TaskRepositoryInterface in AppServiceProvider.
 * 
 * Follows the repository pattern: all DB queries are here.
 * Services never call Task::where() directly — they go through this class.
 */
class TaskRepository implements TaskRepositoryInterface
{
    public function create(array $data): Task
    {
        return Task::create([
            'id'          => $data['id'] ?? Str::uuid()->toString(),
            'user_id'     => $data['user_id'],
            'title'       => $data['title'],
            'description' => $data['description'] ?? null,
            'status'      => $data['status'] ?? 'pending',
        ]);
    }

    public function findById(string $id, ?string $userId = null): ?Task
    {
        $query = Task::where('id', $id);

        if ($userId !== null) {
            $query->where('user_id', $userId);
        }

        return $query->first();
    }

    public function findAll(?string $userId = null): Collection
    {
        $query = Task::query()->latest(); // latest() = ORDER BY created_at DESC

        if ($userId !== null) {
            $query->forUser($userId); // Uses the scope defined on the Model
        }

        return $query->get();
    }

    public function update(string $id, array $data): Task
    {
        $task = Task::findOrFail($id);

        // Only update fields that were provided (PATCH semantics)
        $task->update(array_filter([
            'title'       => $data['title']       ?? null,
            'description' => $data['description'] ?? null,
            'status'      => $data['status']      ?? null,
        ], fn($val) => $val !== null));

        return $task->fresh(); // Reload from DB to get updated_at
    }

    public function delete(string $id): void
    {
        Task::where('id', $id)->delete();
    }
}
