<?php

namespace App\Services\Auth;

use App\Models\User;

/**
 * Auth Strategy Interface.
 * Lives in app/Services/Auth/ — part of the service layer.
 * 
 * Note: onAuthSuccess() no longer receives an HTTP Response object.
 * It returns pure data. The controller is responsible for attaching
 * the token to the response header (separation of concerns).
 */
interface AuthStrategyInterface
{
    /**
     * Validate the incoming request token/session and return the User.
     * Returns null if authentication fails.
     */
    public function authenticate(\Illuminate\Http\Request $request): ?User;

    /**
     * Called after successful login/register.
     * Returns auth data: ['token' => '...'] for JWT, [] for Session.
     */
    public function onAuthSuccess(User $user): array;
}
