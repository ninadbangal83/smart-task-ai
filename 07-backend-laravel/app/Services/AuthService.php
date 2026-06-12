<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Services\Auth\AuthStrategyInterface;
use App\Exceptions\BadRequestException;
use App\Exceptions\UnauthorizedException;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

/**
 * Auth Service — Business Logic Layer (Authentication).
 * 
 * ✅ CORRECT Laravel pattern:
 *   - Constructor DI: receives UserRepositoryInterface + AuthStrategyInterface
 *   - Returns pure data arrays — NO HTTP Response objects passed in
 *   - Controller handles attaching token header (separation of concerns)
 *   - Uses Laravel's Hash facade (bcrypt auto-rounds)
 */
class AuthService
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository,
        private readonly AuthStrategyInterface   $authStrategy,
    ) {}

    /**
     * Register a new user.
     * Returns: ['user' => User, 'token' => string|null]
     */
    public function register(array $data): array
    {
        // Validation handled by RegisterRequest (Form Request) before reaching here
        $existing = $this->userRepository->findByEmail($data['email']);
        if ($existing) {
            Log::warning("⚠️ Registration failed: Email {$data['email']} already exists");
            throw new BadRequestException('User already exists');
        }

        // Industrial logic: First registered user is automatically Admin
        $userCount = $this->userRepository->findAll()->count();
        $role      = $userCount === 0 ? 'admin' : ($data['role'] ?? 'user');

        $user = $this->userRepository->create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']), // Bcrypt hash
            'role'     => $role,
        ]);

        Log::info("👤 New User registered: {$user->email} (ID: {$user->id}) as {$user->role}");

        // Strategy generates token or sets session — returns ['token' => '...'] or []
        $authData = $this->authStrategy->onAuthSuccess($user);

        return array_merge(['user' => $user], $authData);
    }

    /**
     * Log in an existing user.
     * Returns: ['user' => User, 'token' => string|null]
     */
    public function login(string $email, string $password): array
    {
        $user = $this->userRepository->findByEmail($email);

        // Generic error — don't reveal whether email exists (security)
        if (!$user || !Hash::check($password, $user->password)) {
            Log::warning("❌ Login attempt failed for email: {$email}");
            throw new UnauthorizedException('Invalid credentials');
        }

        $authData = $this->authStrategy->onAuthSuccess($user);
        Log::info("✅ User logged in successfully: {$user->email}");

        return array_merge(['user' => $user], $authData);
    }
}
