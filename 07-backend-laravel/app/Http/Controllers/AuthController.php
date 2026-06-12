<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;

/**
 * Auth Controller — the C in Laravel MVC.
 * 
 * ✅ CORRECT Laravel pattern:
 *   - Thin controller: no business logic here
 *   - Constructor DI: receives AuthService (injected by IoC container)
 *   - Form Requests: RegisterRequest/LoginRequest handle all validation
 *   - API Resources: UserResource transforms the response
 *   - Controller only: calls service, returns response
 * 
 * Compare to the wrong version we had earlier (static calls, Response passed to service).
 */
class AuthController extends Controller
{
    public function __construct(
        private readonly AuthService $authService,
    ) {}

    /**
     * POST /api/auth/register
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        // $request->validated() returns only the fields that passed validation
        $result = $this->authService->register($request->validated());

        $response = response()->json([
            'user'  => new UserResource($result['user']),
            'token' => $result['token'] ?? null,
        ], 201);

        // Attach JWT token as X-Auth-Token header (mirrors Node: res.setHeader('X-Auth-Token', token))
        // The React frontend's axios interceptor picks this up automatically
        if (!empty($result['token'])) {
            $response->header('X-Auth-Token', $result['token']);
        }

        return $response;
    }

    /**
     * POST /api/auth/login
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $result = $this->authService->login(
            email:    $request->validated('email'),
            password: $request->validated('password'),
        );

        $response = response()->json([
            'user'  => new UserResource($result['user']),
            'token' => $result['token'] ?? null,
        ]);

        if (!empty($result['token'])) {
            $response->header('X-Auth-Token', $result['token']);
        }

        return $response;
    }
}
