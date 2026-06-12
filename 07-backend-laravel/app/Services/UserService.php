<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Exceptions\NotFoundException;
use App\Exceptions\ForbiddenException;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Log;

/**
 * User Service — User management business logic.
 * Constructor DI: receives UserRepositoryInterface.
 */
class UserService
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository,
    ) {}

    public function getUserById(string $id, User $requester): User
    {
        if ($id !== $requester->id && !$requester->isAdmin()) {
            throw new ForbiddenException('Insufficient permissions to view this profile');
        }

        $user = $this->userRepository->findById($id);
        if (!$user) throw new NotFoundException('User not found');

        return $user;
    }

    public function getAllUsers(): Collection
    {
        return $this->userRepository->findAll();
    }

    public function updateUser(string $id, User $requester, array $data): User
    {
        if ($id !== $requester->id && !$requester->isAdmin()) {
            throw new ForbiddenException('You do not have permission to update this user');
        }

        $updated = $this->userRepository->update($id, $data);
        Log::info("✏️ User updated: {$id} by {$requester->id}");
        return $updated;
    }

    public function deleteUser(string $id, User $requester): void
    {
        if ($id !== $requester->id && !$requester->isAdmin()) {
            throw new ForbiddenException('You do not have permission to delete this user');
        }

        $this->userRepository->delete($id);
        Log::info("🗑️ User deleted: {$id} by {$requester->id}");
    }
}
