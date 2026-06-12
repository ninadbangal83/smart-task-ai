<?php

namespace App\Repositories\Contracts;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

/**
 * User Repository Interface (Contract).
 * Lives in app/Repositories/Contracts/ — bound in AppServiceProvider.
 */
interface UserRepositoryInterface
{
    public function create(array $data): User;

    public function findByEmail(string $email): ?User;

    public function findById(string $id): ?User;

    /** @return Collection<User> */
    public function findAll(): Collection;

    public function update(string $id, array $data): User;

    public function delete(string $id): void;
}
