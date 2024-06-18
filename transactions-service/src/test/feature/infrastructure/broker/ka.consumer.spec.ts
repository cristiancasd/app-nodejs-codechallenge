import { ConsumerRunConfig, EachMessagePayload, KafkaMessage } from 'kafkajs';
import {
  TransactionStatesConstant,
  TransactionTopicsConstant
} from '../../../../core';
import { connectConsumer, disconnectConsumer } from '../../../../feature';
import configureDependencies from '../../../../feature/presentation/config/configureDependencies';

import { configureDependenciesMock, kafkaMock } from '../../../setup';

//console.log('configureDependencies.....', configureDependencies);


const { transactionRepository } = configureDependencies();

// Mock de las dependencias y el cliente Kafka
jest.mock('../../../../feature/presentation/config/configureDependencies');
jest.mock('../../../../feature/infrastructure/broker/kafka.client');




const consumer = kafkaMock.consumer();
describe('Kafka Consumer', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('connectConsumer', () => {
    it('should connect and subscribe to topics', async () => {
      await connectConsumer();

      expect(consumer.connect).toHaveBeenCalled();
      expect(consumer.subscribe).toHaveBeenCalledTimes(1);
      expect(consumer.subscribe).toHaveBeenCalledWith({
        topic: TransactionTopicsConstant.TransactionProcessed,
        fromBeginning: true
      });
      expect(consumer.run).toHaveBeenCalled();
    });

    /*it('should process messages correctly', async () => {
      const mockMessage: KafkaMessage = {
        key: null,
        value: Buffer.from(
          JSON.stringify({
            transactionExternalId: 'test-id',
            transactionStatus: { name: TransactionStatesConstant.pending }
          })
        ),
        timestamp: Date.now().toString(),
        attributes: 0,
        offset: '0',
        headers: {}
      };

      const eachMessagePayload: EachMessagePayload = {
        topic: TransactionTopicsConstant.TransactionProcessed,
        partition: 0,
        message: mockMessage,
        heartbeat: jest.fn().mockResolvedValue(undefined),
        pause: jest.fn()
      };

      consumer.run.mockImplementationOnce(async (config: ConsumerRunConfig) => {
        if (config.eachMessage) {
          await config.eachMessage(eachMessagePayload);
        }
      });

      await connectConsumer();

      expect(transactionRepository.editTransaction).toHaveBeenCalledWith(
        'test-id',
        TransactionStatesConstant.pending
      );
    });

    it('should handle message processing errors', async () => {
      const mockMessage: KafkaMessage = {
        key: null,
        value: Buffer.from('invalid-json'),
        timestamp: Date.now().toString(),
        attributes: 0,
        offset: '0',
        headers: {}
      };

      const eachMessagePayload: EachMessagePayload = {
        topic: TransactionTopicsConstant.TransactionProcessed,
        partition: 0,
        message: mockMessage,
        heartbeat: jest.fn().mockResolvedValue(undefined),
        pause: jest.fn()
      };

      consumer.run.mockImplementationOnce(async (config: ConsumerRunConfig) => {
        if (config.eachMessage) {
          await config.eachMessage(eachMessagePayload);
        }
      });

      await connectConsumer();

      expect(transactionRepository.editTransaction).not.toHaveBeenCalled();
    });*/
  });

  /*describe('disconnectConsumer', () => {
    it('should disconnect from the consumer', async () => {
      await disconnectConsumer();

      expect(consumer.disconnect).toHaveBeenCalled();
    });
  });*/
});
