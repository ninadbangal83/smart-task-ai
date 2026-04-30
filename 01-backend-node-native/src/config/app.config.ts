import 'dotenv/config';
import { z } from 'zod';

// 1. Define the Schema for your Environment Variables
const envSchema = z.object({
  PORT: z.string().default('3000').transform(Number),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Infrastructure Toggles
  DB_TYPE: z.enum(['MONGO', 'POSTGRES']).default('MONGO'),
  BROKER_TYPE: z.enum(['RABBITMQ', 'KAFKA', 'BULLMQ']).default('RABBITMQ'),
  
  // Connection Strings
  MONGO_URI: z.string().default('mongodb://localhost:27017/smart_task_ai'),
  POSTGRES_URI: z.string().optional(),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  RABBITMQ_URL: z.string().default('amqp://localhost:5672'),
  KAFKA_URL: z.string().default('localhost:9092'),
  AUTH_TYPE: z.enum(['JWT', 'SESSION']).default('JWT'),
  RABBITMQ_URI: z.string().optional(),

  // Auth
  JWT_SECRET: z.string().default('super-secret-key'),

  // Redis
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.string().default('6379').transform(Number),

  // Observability Swapper
  LOGGER_TYPE: z.enum(['WINSTON', 'PINO']).default('WINSTON'),
});

// 2. Parse and Validate
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid Environment Variables:', _env.error.format());
  process.exit(1);
}

// 3. Export the validated config
export const config = _env.data;
