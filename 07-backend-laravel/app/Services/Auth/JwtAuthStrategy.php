<?php

namespace App\Services\Auth;

use App\Models\User;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Http\Request;

/**
 * JWT Auth Strategy.
 * Extracts Bearer token, verifies it, and returns the User model.
 * onAuthSuccess() generates a JWT and returns it — controller sets the header.
 */
class JwtAuthStrategy implements AuthStrategyInterface
{
    private string $secret;
    private string $algorithm = 'HS256';

    public function __construct()
    {
        $this->secret = config('smarttask.jwt_secret');
    }

    public function authenticate(Request $request): ?User
    {
        $authHeader = $request->header('Authorization', '');

        if (!str_starts_with($authHeader, 'Bearer ')) {
            return null;
        }

        $token = substr($authHeader, 7);

        try {
            $decoded = JWT::decode($token, new Key($this->secret, $this->algorithm));
            // Load the full User model from DB (not just the token payload)
            return User::find($decoded->id);
        } catch (\Exception) {
            return null;
        }
    }

    /**
     * Generate JWT token. Controller attaches it as X-Auth-Token header.
     */
    public function onAuthSuccess(User $user): array
    {
        $ttl = config('smarttask.jwt_ttl', 1440); // minutes

        $payload = [
            'iss'   => 'smarttask-laravel',
            'iat'   => time(),
            'exp'   => time() + ($ttl * 60),
            'id'    => $user->id,
            'email' => $user->email,
            'name'  => $user->name,
            'role'  => $user->role,
        ];

        return ['token' => JWT::encode($payload, $this->secret, $this->algorithm)];
    }
}
