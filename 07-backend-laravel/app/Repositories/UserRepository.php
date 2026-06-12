<?php

namespace App\Repositories;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;

/**
 * User Repository — Eloquent implementation of UserRepositoryInterface.
 * Bound to UserRepositoryInterface in AppServiceProvider.
 */
class UserRepository implements UserRepositoryInterface
{
    public function create(array $data): User
    {
        return User::create([
            'id'       => $data['id']       ?? Str::uuid()->toString(),
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => $data['password'], // Already hashed by AuthService
            'role'     => $data['role']      ?? 'user',
        ]);
    }

    public function findByEmail(string $email): ?User
    {
        // withoutGlobalScopes: avoids any soft-delete or hidden scopes
        return User::where('email', $email)->first();
    }

    public function findById(string $id): ?User
    {
        return User::find($id);
    }

    public function findAll(): Collection
    {
        return User::all();
    }

    public function update(string $id, array $data): User
    {
        $user = User::findOrFail($id);

        $user->update(array_filter([
            'name'  => $data['name']  ?? null,
            'email' => $data['email'] ?? null,
            'role'  => $data['role']  ?? null,
        ], fn($val) => $val !== null));

        return $user->fresh();
    }

    public function delete(string $id): void
    {
        User::where('id', $id)->delete();
    }
}
