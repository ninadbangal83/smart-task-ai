<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Contracts\TaskRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Repositories\TaskRepository;
use App\Repositories\UserRepository;
use App\Services\Auth\AuthStrategyInterface;
use App\Services\Auth\JwtAuthStrategy;
use App\Services\Auth\SessionAuthStrategy;
use App\Services\Broker\BrokerInterface;
use App\Services\Broker\RabbitMQBroker;
use App\Services\Broker\BullMQBroker;

/**
 * AppServiceProvider — THE central DI wiring file in Laravel.
 * 
 * This is where Interface → Implementation bindings are registered.
 * When Laravel's IoC container sees TaskRepositoryInterface in a constructor,
 * it automatically injects TaskRepository. No factories, no new(), no static calls.
 * 
 * This is the equivalent of the various Factory classes in the Node backends,
 * but done the correct Laravel/PHP way via the IoC container.
 */
class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // ─── Repository Bindings ──────────────────────────────────────
        // Interface → Concrete implementation.
        // To swap to a MongoRepository: change TaskRepository::class here only.
        $this->app->bind(TaskRepositoryInterface::class, TaskRepository::class);
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);

        // ─── Auth Strategy Binding (SWITCH MATRIX: AUTH_TYPE) ─────────
        // Mirrors: AuthFactory.getStrategy() → JWT | SESSION
        $this->app->bind(AuthStrategyInterface::class, function () {
            return match (config('smarttask.auth_type')) {
                'SESSION' => new SessionAuthStrategy(),
                default   => new JwtAuthStrategy(), // JWT is default
            };
        });

        // ─── Broker Binding (SWITCH MATRIX: BROKER_TYPE) ──────────────
        // Mirrors: BrokerFactory.getBroker() → BULLMQ | RABBITMQ
        // singleton() = same instance reused (important for RabbitMQ connection)
        $this->app->singleton(BrokerInterface::class, function () {
            return match (config('smarttask.broker_type')) {
                'RABBITMQ' => new RabbitMQBroker(),
                default    => new BullMQBroker(), // BULLMQ (Redis-backed) is default
            };
        });
    }

    public function boot(): void
    {
        //
    }
}
