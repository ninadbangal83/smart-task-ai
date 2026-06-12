<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| API Routes — SmartTask AI (Laravel)
|--------------------------------------------------------------------------
| All routes are prefixed with /api automatically via bootstrap/app.php.
| Route::apiResource() generates index/show/store/update/destroy automatically.
*/

// ─── Health Check (Public) ────────────────────────────────────────────────
Route::get('/health', function () {
    return response()->json([
        'status'       => 'UP',
        'timestamp'    => now()->toISOString(),
        'database'     => config('smarttask.db_type'),
        'broker'       => config('smarttask.broker_type'),
        'mode'         => app()->environment(),
        'authStrategy' => config('smarttask.auth_type'), // Frontend auto-syncs from this
    ]);
});

// ─── Auth Routes (Public) ─────────────────────────────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);
});

// ─── Protected Routes (require valid JWT / Session) ───────────────────────
Route::middleware('auth.smarttask')->group(function () {

    // Task CRUD — uses Laravel's apiResource (generates all 5 RESTful routes)
    Route::apiResource('tasks', TaskController::class);

    // User profile (self)
    Route::prefix('users')->group(function () {
        Route::get('/me',    [UserController::class, 'me']);
        Route::put('/me',    [UserController::class, 'updateMe']);
        Route::delete('/me', [UserController::class, 'deleteMe']);
    });

    // ─── Admin-only Routes ───────────────────────────────────────────
    Route::middleware('auth.admin')->prefix('admin')->group(function () {
        Route::get('/users',          [UserController::class, 'index']);
        Route::put('/users/{id}',     [UserController::class, 'update']);
        Route::delete('/users/{id}',  [UserController::class, 'destroy']);
    });
});
