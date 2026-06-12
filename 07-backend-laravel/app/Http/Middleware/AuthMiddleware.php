<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Services\Auth\AuthStrategyInterface;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

/**
 * Auth Middleware — protects routes by running the active auth strategy.
 * 
 * AuthStrategyInterface is injected by Laravel's IoC container.
 * The middleware attaches the authenticated User model to request attributes
 * so controllers can access it via $request->attributes->get('authenticated_user').
 */
class AuthMiddleware
{
    public function __construct(
        private readonly AuthStrategyInterface $authStrategy,
    ) {}

    public function handle(Request $request, Closure $next): Response
    {
        $user = $this->authStrategy->authenticate($request);

        if (!$user) {
            Log::warning("🚫 Unauthorized: {$request->method()} {$request->path()}");
            return response()->json([
                'status'  => 'error',
                'message' => 'Unauthorized: Access Denied',
            ], 401);
        }

        // Attach authenticated user to request
        $request->attributes->set('authenticated_user', $user);
        Log::debug("🔑 Authenticated User: {$user->id}");

        return $next($request);
    }
}

/**
 * Admin Middleware — restricts endpoints to admin users only.
 * Applied on top of AuthMiddleware (auth runs first, then admin check).
 */
class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->attributes->get('authenticated_user');

        if (!$user || !$user->isAdmin()) {
            Log::warning("🚫 Forbidden: {$user?->id} attempted admin route {$request->path()}");
            return response()->json([
                'status'  => 'error',
                'message' => 'Forbidden: Insufficient permissions',
            ], 403);
        }

        return $next($request);
    }
}
