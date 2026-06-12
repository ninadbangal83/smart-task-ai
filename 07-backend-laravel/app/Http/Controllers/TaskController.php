<?php

namespace App\Http\Controllers;

use App\Http\Requests\Task\CreateTaskRequest;
use App\Http\Requests\Task\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Services\TaskService;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Task Controller — the C in Laravel MVC for Task CRUD.
 * 
 * ✅ CORRECT Laravel pattern:
 *   - Constructor DI: receives TaskService
 *   - $request->user() pattern: gets authenticated user (set by AuthMiddleware)
 *   - API Resources: TaskResource wraps all responses
 *   - RESTful methods: index, show, store, update, destroy (Laravel naming convention)
 */
class TaskController extends Controller
{
    public function __construct(
        private readonly TaskService $taskService,
    ) {}

    /**
     * GET /api/tasks
     * mirrors: TaskController.getAll()
     */
    public function index(Request $request): JsonResponse
    {
        /** @var User $user */
        $user  = $request->attributes->get('authenticated_user');
        $tasks = $this->taskService->getAllTasks($user);

        return TaskResource::collection($tasks)->response();
    }

    /**
     * GET /api/tasks/{id}
     * mirrors: TaskController.getById()
     */
    public function show(Request $request, string $id): JsonResponse
    {
        /** @var User $user */
        $user = $request->attributes->get('authenticated_user');
        $task = $this->taskService->getTaskById($id, $user);

        return (new TaskResource($task))->response();
    }

    /**
     * POST /api/tasks
     * mirrors: TaskController.create()
     */
    public function store(CreateTaskRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->attributes->get('authenticated_user');
        $task = $this->taskService->createTask(
            title:       $request->validated('title'),
            userId:      $user->id,
            description: $request->validated('description'),
        );

        return (new TaskResource($task))->response()->setStatusCode(201);
    }

    /**
     * PUT /api/tasks/{id}
     * mirrors: TaskController.update()
     */
    public function update(UpdateTaskRequest $request, string $id): JsonResponse
    {
        /** @var User $user */
        $user    = $request->attributes->get('authenticated_user');
        $updated = $this->taskService->updateTask($id, $user, $request->validated());

        return (new TaskResource($updated))->response();
    }

    /**
     * DELETE /api/tasks/{id}
     * mirrors: TaskController.delete()
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        /** @var User $user */
        $user = $request->attributes->get('authenticated_user');
        $this->taskService->deleteTask($id, $user);

        return response()->json(null, 204);
    }
}
