<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Exceptions\AppException;
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| Laravel 11 Application Bootstrap
|--------------------------------------------------------------------------
| Laravel 11 consolidated all config into bootstrap/app.php.
| This is where middleware aliases, exception handling, and routing are wired.
*/

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api:                __DIR__ . '/../routes/api.php',
        apiPrefix:          'api',
        health:             '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // ─── Middleware Aliases ───────────────────────────────────────────
        // These short names are used in routes/api.php
        $middleware->alias([
            'auth.smarttask' => \App\Http\Middleware\AuthMiddleware::class,
            'auth.admin'     => \App\Http\Middleware\AdminMiddleware::class,
        ]);

        // ─── CORS ─────────────────────────────────────────────────────────
        $middleware->api(prepend: [
            \Illuminate\Http\Middleware\HandleCors::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // ─── Global Exception Handler ─────────────────────────────────────
        // Convert all AppException subclasses to JSON error responses.
        // This replaces the manual try/catch blocks in Node's global error handler.
        $exceptions->render(function (AppException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'status'  => 'error',
                    'message' => $e->getMessage(),
                ], $e->statusCode);
            }
        });

        // ─── Validation Errors → 422 JSON ─────────────────────────────────
        $exceptions->render(function (\Illuminate\Validation\ValidationException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'status'  => 'error',
                    'message' => $e->getMessage(),
                    'errors'  => $e->errors(),
                ], 422);
            }
        });
    })
    ->create();
