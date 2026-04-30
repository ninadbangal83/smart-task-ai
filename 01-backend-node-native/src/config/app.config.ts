import 'dotenv/config';
import { z } from 'zod';

// 1. Define the Schema for your Environment Variables
const envSchema = z.object({
  PORT: z.string().default('3000').transform(Number),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Database
  DB_TYPE: z.enum(['MONGO', 'POSTGRES']).default('MONGO'),
  MONGO_URI: z.string().optional(),
  POSTGRES_URI: z.string().optional(),

  // Broker
  BROKER_TYPE: z.enum(['RABBITMQ', 'BULLMQ', 'KAFKA']).default('RABBITMQ'),
  AUTH_TYPE: z.enum(['JWT', 'SESSION']).default('JWT'),
  RABBITMQ_URI: z.string().optional(),

  // Auth
  JWT_SECRET: z.string().default('super-secret-key'),

  // Redis
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.string().default('6379').transform(Number),
});

// 2. Parse and Validate
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid Environment Variables:', _env.error.format());
  process.exit(1);
}

// 3. Export the validated config
export const config = _env.data;
