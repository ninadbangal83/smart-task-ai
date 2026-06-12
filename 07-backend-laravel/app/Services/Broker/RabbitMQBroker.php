<?php

namespace App\Services\Broker;

use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;
use Illuminate\Support\Facades\Log;

class RabbitMQBroker implements BrokerInterface
{
    private ?AMQPStreamConnection $connection = null;
    private mixed $channel = null;

    private function connect(): void
    {
        if ($this->connection !== null) return;

        try {
            $this->connection = new AMQPStreamConnection(
                config('smarttask.rabbitmq_host'),
                config('smarttask.rabbitmq_port'),
                config('smarttask.rabbitmq_user'),
                config('smarttask.rabbitmq_password'),
            );
            $this->channel = $this->connection->channel();
            Log::info('✅ RabbitMQ Connected');
        } catch (\Exception $e) {
            Log::error('❌ RabbitMQ Connection Failed:', ['error' => $e->getMessage()]);
        }
    }

    public function publish(string $topic, array $message): void
    {
        $this->connect();
        if ($this->channel === null) return;

        try {
            $this->channel->queue_declare($topic, false, true, false, false);
            $this->channel->basic_publish(
                new AMQPMessage(
                    json_encode($message),
                    ['delivery_mode' => AMQPMessage::DELIVERY_MODE_PERSISTENT]
                ),
                '',
                $topic
            );
            Log::debug("📤 RabbitMQ published to {$topic}");
        } catch (\Exception $e) {
            Log::error("❌ RabbitMQ publish error on {$topic}:", ['error' => $e->getMessage()]);
        }
    }

    public function disconnect(): void
    {
        $this->channel?->close();
        $this->connection?->close();
        $this->connection = null;
        $this->channel    = null;
    }
}
