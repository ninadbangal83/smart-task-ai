<?php

/**
 * SmartTask AI - Custom Config
 * Mirrors the app.config.ts pattern from Node backends.
 * 
 * Access via: config('smarttask.db_type'), config('smarttask.broker_type'), etc.
 */
return [

    // ==========================================
    // 🔀 SWITCH MATRIX (same env vars as all other backends)
    // ==========================================
    'db_type'      => strtoupper(env('DB_TYPE', 'POSTGRES')),   // POSTGRES | MONGO
    'broker_type'  => strtoupper(env('BROKER_TYPE', 'BULLMQ')), // BULLMQ | RABBITMQ
    'ai_provider'  => strtoupper(env('AI_PROVIDER', 'MOCK')),   // GEMINI | MOCK
    'auth_type'    => strtoupper(env('AUTH_TYPE', 'JWT')),       // JWT | SESSION
    'logger_type'  => strtoupper(env('LOGGER_TYPE', 'MONOLOG')),

    // ==========================================
    // 🗄️ Database
    // ==========================================
    'mongo_uri' => env('MONGO_URI', 'mongodb://localhost:27017/smart_task_ai'),

    // ==========================================
    // 📦 Redis
    // ==========================================
    'redis_host' => env('REDIS_HOST', '127.0.0.1'),
    'redis_port' => (int) env('REDIS_PORT', 6379),

    // ==========================================
    // 🐇 RabbitMQ
    // ==========================================
    'rabbitmq_host'     => env('RABBITMQ_HOST', 'localhost'),
    'rabbitmq_port'     => (int) env('RABBITMQ_PORT', 5672),
    'rabbitmq_user'     => env('RABBITMQ_USER', 'guest'),
    'rabbitmq_password' => env('RABBITMQ_PASSWORD', 'guest'),

    // ==========================================
    // 🤖 AI
    // ==========================================
    'gemini_api_key' => env('GEMINI_API_KEY', ''),

    // ==========================================
    // 🔐 JWT
    // ==========================================
    'jwt_secret' => env('JWT_SECRET', 'super-secret-key'),
    'jwt_ttl'    => (int) env('JWT_TTL', 1440), // minutes

    // ==========================================
    // 🌐 CORS
    // ==========================================
    'frontend_url' => env('FRONTEND_URL', 'http://localhost:4200'),
];
