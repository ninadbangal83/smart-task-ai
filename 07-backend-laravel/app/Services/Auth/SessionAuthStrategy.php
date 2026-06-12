<?php

namespace App\Services\Auth;

use App\Models\User;
use Illuminate\Http\Request;

/**
 * Session Auth Strategy.
 * Uses Laravel's session (managed by the session middleware + cookie).
 * The frontend must send requests with withCredentials: true.
 */
class SessionAuthStrategy implements AuthStrategyInterface
{
    public function authenticate(Request $request): ?User
    {
        $userId = $request->session()->get('auth_user_id');

        if (!$userId) return null;

        return User::find($userId);
    }

    public function onAuthSuccess(User $user): array
    {
        // Store just the user ID in session (not the whole user object)
        request()->session()->put('auth_user_id', $user->id);
        request()->session()->regenerate(); // Security: new session ID on login

        return []; // No token — browser manages the cookie automatically
    }
}
