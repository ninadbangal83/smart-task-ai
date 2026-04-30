import { Queue } from 'bullmq';
import { IBroker } from './ibroker';

export class BullMQService implements IBroker {
  private queues: Map<string, Queue> = new Map();

  async init(): Promise<void> {
    console.log('✅ BullMQ Initialized (Using Redis)');
  }

  async publish(queueName: string, message: any): Promise<void> {
    if (!this.queues.has(queueName)) {
      this.queues.set(queueName, new Queue(queueName, {
        connection: {
          host: process.env.REDIS_HOST || 'localhost',
          port: Number(process.env.REDIS_PORT) || 6379
        }
      }));
    }
    await this.queues.get(queueName)?.add('task_job', message);
    console.log(`[BullMQ] Message published to ${queueName}`);
  }
}
