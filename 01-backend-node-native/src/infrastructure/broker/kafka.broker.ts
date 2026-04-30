import { Kafka, Producer } from 'kafkajs';
import { IBroker } from '@domain/brokers/ibroker';
import { config } from '@config/app.config';
import { logger } from '@shared/utils/logger';

export class KafkaBroker implements IBroker {
  private kafka: Kafka;
  private producer: Producer;
  private isConnected: boolean = false;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'smart-task-ai',
      brokers: [config.KAFKA_URL]
    });
    this.producer = this.kafka.producer();
  }

  async connect(): Promise<void> {
    if (this.isConnected) return;
    try {
      await this.producer.connect();
      this.isConnected = true;
      logger.info('🐘 Kafka Connected Successfully');
    } catch (err: any) {
      logger.error('❌ Kafka Connection Error:', { error: err.message });
    }
  }

  async publish(topic: string, message: any): Promise<void> {
    await this.connect();
    try {
      await this.producer.send({
        topic,
        messages: [{ value: JSON.stringify(message) }]
      });
      logger.debug(`📤 Kafka Message Published to ${topic}`);
    } catch (err: any) {
      logger.error(`❌ Kafka Publish Error on ${topic}:`, { error: err.message });
    }
  }

  async disconnect(): Promise<void> {
    await this.producer.disconnect();
    this.isConnected = false;
  }
}
