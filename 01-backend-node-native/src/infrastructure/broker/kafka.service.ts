import { Kafka, Producer } from 'kafkajs';
import { IBroker } from './ibroker';

export class KafkaService implements IBroker {
  private kafka: Kafka;
  private producer: Producer;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'smarttask-app',
      brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
    });
    this.producer = this.kafka.producer();
  }

  async init(): Promise<void> {
    await this.producer.connect();
    console.log('✅ Kafka Producer Connected');
  }

  async publish(topic: string, message: any): Promise<void> {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }]
    });
    console.log(`[Kafka] Message published to ${topic}`);
  }
}
