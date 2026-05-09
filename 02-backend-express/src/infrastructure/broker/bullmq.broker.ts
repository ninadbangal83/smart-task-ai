import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { IBroker } from '@domain/brokers/ibroker';
import { config } from '@config/app.config';
import { logger } from '@shared/utils/logger';

export class BullMQBroker implements IBroker {
  private queues: Map<string, Queue> = new Map();
  private redisConnection: IORedis | null = null;

  async connect(): Promise<void> {
    if (this.redisConnection) return;
    try {
      this.redisConnection = new IORedis(config.REDIS_URL, {
        maxRetriesPerRequest: null,
      });
      logger.info('✅ BullMQ (Redis) Connected Successfully');
    } catch (err: any) {
      logger.error('❌ BullMQ Connection Error:', { error: err.message });
    }
  }

  async publish(topic: string, message: any): Promise<void> {
    if (!this.redisConnection) await this.connect();
    
    try {
      let queue = this.queues.get(topic);
      if (!queue) {
        queue = new Queue(topic, { connection: this.redisConnection! });
        this.queues.set(topic, queue);
      }

      await queue.add('task-job', message, {
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 },
      });
      
      logger.debug(`📤 BullMQ Job added to ${topic}`);
    } catch (err: any) {
      logger.error(`❌ BullMQ Publish Error on ${topic}:`, { error: err.message });
    }
  }

  async disconnect(): Promise<void> {
    for (const queue of this.queues.values()) {
      await queue.close();
    }
    if (this.redisConnection) {
      await this.redisConnection.quit();
    }
    this.queues.clear();
    this.redisConnection = null;
  }
}
