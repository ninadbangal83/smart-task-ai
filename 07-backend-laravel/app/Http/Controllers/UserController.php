<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Services\UserService;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * User Controller — profile management and admin user management.
 */
class UserController extends Controller
{
    public function __construct(
        private readonly UserService $userService,
    ) {}

    /**
     * GET /api/users/me — Get my own profile
     */
    public function me(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->attributes->get('authenticated_user');
        return (new UserResource(
            $this->userService->getUserById($user->id, $user)
        ))->response();
    }

    /**
     * PUT /api/users/me — Update my own profile
     */
    public function updateMe(Request $request): JsonResponse
    {
        /** @var User $user */
        $user    = $request->attributes->get('authenticated_user');
        $updated = $this->userService->updateUser($user->id, $user, $request->only(['name', 'email']));

        return (new UserResource($updated))->response();
    }

    /**
     * DELETE /api/users/me — Delete my own account
     */
    public function deleteMe(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->attributes->get('authenticated_user');
        $this->userService->deleteUser($user->id, $user);

        return response()->json(null, 204);
    }

    // ─── Admin-only endpoints ───────────────────────────────────────

    /**
     * GET /api/admin/users — List all users (Admin only)
     */
    public function index(): JsonResponse
    {
        return UserResource::collection(
            $this->userService->getAllUsers()
        )->response();
    }

    /**
     * PUT /api/admin/users/{id} — Admin update any user
     */
    public function update(Request $request, string $id): JsonResponse
    {
        /** @var User $requester */
        $requester = $request->attributes->get('authenticated_user');
        $updated   = $this->userService->updateUser($id, $requester, $request->only(['name', 'email', 'role']));

        return (new UserResource($updated))->response();
    }

    /**
     * DELETE /api/admin/users/{id} — Admin delete any user
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        /** @var User $requester */
        $requester = $request->attributes->get('authenticated_user');
        $this->userService->deleteUser($id, $requester);

        return response()->json(null, 204);
    }
}
