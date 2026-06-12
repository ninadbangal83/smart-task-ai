<?php

namespace App\Services\Broker;

/**
 * Broker Interface — contract for all message broker implementations.
 * Lives in app/Services/Broker/ and is bound in AppServiceProvider.
 */
interface BrokerInterface
{
    public function publish(string $topic, array $message): void;

    public function disconnect(): void;
}
