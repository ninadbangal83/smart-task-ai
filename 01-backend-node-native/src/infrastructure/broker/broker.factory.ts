import { config } from '@config/app.config';
import { IBroker } from '@domain/brokers/ibroker';
import { RabbitMQBroker } from './rabbitmq.broker';
import { KafkaBroker } from './kafka.broker';
import { BullMQBroker } from './bullmq.broker';

export class BrokerFactory {
  private static instance: IBroker | null = null;

  static getBroker(): IBroker {
    if (this.instance) return this.instance;

    const type = config.BROKER_TYPE.toUpperCase();

    if (type === 'KAFKA') {
      this.instance = new KafkaBroker();
    } else if (type === 'BULLMQ') {
      this.instance = new BullMQBroker();
    } else {
      this.instance = new RabbitMQBroker();
    }

    return this.instance;
  }
}
