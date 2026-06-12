<?php

namespace App\Services\Broker;

use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Log;

/**
 * BullMQ-style broker using Laravel's built-in Redis facade.
 * Pushes jobs onto a Redis list — the same underlying transport BullMQ uses.
 * A `php artisan queue:work` worker can consume these jobs.
 */
class BullMQBroker implements BrokerInterface
{
    public function publish(string $topic, array $message): void
    {
        try {
            $job = json_encode([
                'id'        => uniqid('job_', true),
                'data'      => $message,
                'timestamp' => now()->toISOString(),
                'topic'     => $topic,
            ]);

            // RPUSH onto a Redis list — same as BullMQ's internal queue structure
            Redis::rpush("smarttask:queue:{$topic}", $job);
            Log::debug("📤 BullMQ Job enqueued on {$topic}");
        } catch (\Exception $e) {
            Log::error("❌ BullMQ publish error on {$topic}:", ['error' => $e->getMessage()]);
        }
    }

    public function disconnect(): void
    {
        // Laravel's Redis facade manages the connection lifecycle — no manual close needed
    }
}
