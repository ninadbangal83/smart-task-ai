import Redis from 'ioredis';
import { config } from '@config/app.config';
import { logger } from '@shared/utils/logger';

export class RedisService {
  private static instance: Redis;

  static getInstance(): Redis {
    if (!RedisService.instance) {
      RedisService.instance = new Redis({
        host: config.REDIS_HOST,
        port: config.REDIS_PORT,
      });

      RedisService.instance.on('error', (err) => logger.error('Redis Error:', { error: err }));
      RedisService.instance.on('connect', () => logger.info('✅ Redis Connected'));
    }
    return RedisService.instance;
  }

  static async set(key: string, value: any, ttl = 3600): Promise<void> {
    const client = this.getInstance();
    await client.set(key, JSON.stringify(value), 'EX', ttl);
  }

  static async get<T>(key: string): Promise<T | null> {
    const client = this.getInstance();
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  }

  static async del(key: string): Promise<void> {
    const client = this.getInstance();
    await client.del(key);
  }
}
