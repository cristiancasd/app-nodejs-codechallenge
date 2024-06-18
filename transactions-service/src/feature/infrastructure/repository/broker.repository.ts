import { errorHandlerBroker } from '../../../core';

import { BrokerEntity, BrokerRepositoryInterface } from '../../domain';
import { producer } from '../broker/kafka.producer';

export class BrokerRepositoryImpl implements BrokerRepositoryInterface {
  constructor() {}

  @errorHandlerBroker
  async sendMessageBroker(data: BrokerEntity): Promise<BrokerEntity> {
    console.log('Repository: enviar mensaje broker KAFKA');

    await producer.send({
      topic: data.topic,
      messages: [{ value: JSON.stringify(data.message) }]
    });
    console.log('message sended to kafka');
    return data;
  }
}
