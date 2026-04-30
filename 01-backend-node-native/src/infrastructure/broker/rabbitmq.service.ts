import amqp from 'amqplib';
import { logger } from '@shared/utils/logger';
import { IBroker } from './ibroker';

export class RabbitMQService implements IBroker {
  private connection: any;
  private channel: any;

  async init(): Promise<void> {
    if (this.connection) return;
    try {
      this.connection = await amqp.connect(process.env.RABBITMQ_URI || 'amqp://localhost');
      this.channel = await this.connection.createChannel();
      logger.info('✅ RabbitMQ Connected');
    } catch (err) {
      logger.error('❌ RabbitMQ Failed:', { error: err });
    }
  }

  async publish(queue: string, message: any): Promise<void> {
    if (!this.channel) await this.init();
    await this.channel.assertQueue(queue, { durable: true });
    this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });
    logger.info(`[RabbitMQ] Message published to ${queue}`);
  }
}
