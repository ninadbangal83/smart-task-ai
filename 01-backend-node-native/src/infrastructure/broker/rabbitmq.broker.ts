import amqp from 'amqplib';
import { logger } from '@shared/utils/logger';
import { IBroker } from '@domain/brokers/ibroker';
import { config } from '@config/app.config';

export class RabbitMQBroker implements IBroker {
  private connection: any = null;
  private channel: any = null;

  async connect(): Promise<void> {
    if (this.connection) return;
    try {
      // Forcefully bypassing the amqplib type conflict with 'as any'
      this.connection = await (amqp.connect(config.RABBITMQ_URL) as any);
      this.channel = await (this.connection.createChannel() as any);
      logger.info('✅ RabbitMQ Connected');
    } catch (err: any) {
      logger.error('❌ RabbitMQ Failed:', { error: err.message });
    }
  }

  async publish(topic: string, message: any): Promise<void> {
    if (!this.channel) await this.connect();
    if (!this.channel) return;

    try {
      await this.channel.assertQueue(topic, { durable: true });
      this.channel.sendToQueue(topic, Buffer.from(JSON.stringify(message)), {
        persistent: true,
      });
      logger.debug(`📤 RabbitMQ Message published to ${topic}`);
    } catch (err: any) {
      logger.error(`❌ RabbitMQ Publish Error on ${topic}:`, { error: err.message });
    }
  }

  async disconnect(): Promise<void> {
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();
    this.connection = null;
    this.channel = null;
  }
}
