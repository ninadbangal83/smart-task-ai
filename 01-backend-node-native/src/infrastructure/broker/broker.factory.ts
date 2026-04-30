import { config } from '@config/app.config';
import { IBroker } from './ibroker';
import { RabbitMQService } from './rabbitmq.service';
import { BullMQService } from './bullmq.service';
import { KafkaService } from './kafka.service';

export class BrokerFactory {
  private static instance: IBroker;

  static getBroker(): IBroker {
    if (this.instance) return this.instance;

    const brokerType = config.BROKER_TYPE;

    switch (brokerType.toUpperCase()) {
      case 'RABBITMQ':
        this.instance = new RabbitMQService();
        break;
      case 'BULLMQ':
        this.instance = new BullMQService();
        break;
      case 'KAFKA':
        this.instance = new KafkaService();
        break;
      default:
        throw new Error(`Unsupported broker type: ${brokerType}`);
    }

    return this.instance;
  }
}
