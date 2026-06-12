<?php

namespace App\Repositories\Contracts;

use App\Models\Task;
use Illuminate\Database\Eloquent\Collection;

/**
 * Task Repository Interface (Contract).
 * 
 * Lives in app/Repositories/Contracts/ — the Laravel standard location
 * for interface contracts used by the repository pattern.
 * 
 * The IoC binding (Interface → Implementation) is registered in AppServiceProvider.
 * Controllers/Services receive this interface via constructor injection — they
 * never know which concrete class (Eloquent, Mongo, etc.) is behind it.
 */
interface TaskRepositoryInterface
{
    public function create(array $data): Task;

    public function findById(string $id, ?string $userId = null): ?Task;

    /** @return Collection<Task> */
    public function findAll(?string $userId = null): Collection;

    public function update(string $id, array $data): Task;

    public function delete(string $id): void;
}
