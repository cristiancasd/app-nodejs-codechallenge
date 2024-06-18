import { KafkaMessage } from 'kafkajs';
import {
  TransactionStatesConstant,
  TransactionTopicsConstant
} from '../../../core';
import { processTransaction } from '../../../application/processTransaction';
import { consumer, disconnectConsumer, runConsumer } from '../../../infrastructure/kafka/kafkaConsumer';
import { kafkaProducer } from '../../../infrastructure/kafka/kafkaProducer';
jest.mock('../../../application/processTransaction');
jest.mock('../../../infrastructure/kafka/kafkaProducer', () => ({
  kafkaProducer: {
    send: jest.fn()
  }
}));
jest.mock('../../../infrastructure/kafka/kafkaClient', () => ({
  kafka: {
    consumer: jest.fn(() => ({
      connect: jest.fn(),
      disconnect: jest.fn(),
      subscribe: jest.fn(),
      run: jest.fn()
    }))
  }
}));

describe('Kafka Consumer', () => {
  const mockKafkaClient = require('../../../infrastructure/kafka/kafkaClient').kafka;
  const mockProcessTransaction = processTransaction as jest.Mock;

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('runConsumer', () => {
    it('should connect, subscribe, and run the consumer', async () => {
      await runConsumer();

      expect(consumer.connect).toHaveBeenCalled();
      expect(consumer.subscribe).toHaveBeenCalledWith({
        topic: TransactionTopicsConstant.TransactionCreated,
        fromBeginning: true
      });
      expect(consumer.run).toHaveBeenCalled();
    });

    it('should process messages correctly', async () => {
      const mockMessage: KafkaMessage = {
        key: null,
        value: Buffer.from(
          JSON.stringify({
            transactionExternalId: 'test-id',
            transactionStatus: { name: TransactionStatesConstant.pending },
            value:8000,
            
          })
        ),
        timestamp: Date.now().toString(),
        attributes: 0,
        offset: '0',
        headers: {}
      };

      const inputKafka = {
        topic: TransactionTopicsConstant.TransactionCreated,
        partition: 0,
        message: mockMessage,
        heartbeat: jest.fn().mockResolvedValue(undefined),
        pause: jest.fn()
      };

      mockProcessTransaction.mockReturnValue(false);

      (consumer.run as jest.Mock).mockImplementationOnce(async (config: any) => {
        if (config.eachMessage) {
          await config.eachMessage(inputKafka);
        }
      });

      await runConsumer();

      expect(mockProcessTransaction).toHaveBeenCalledWith({
        transactionExternalId: 'test-id',
        transactionStatus: { name: TransactionStatesConstant.rejected },
        value: 8000
      });

      expect(kafkaProducer.send).toHaveBeenCalledWith({
        topic: TransactionTopicsConstant.TransactionProcessed,
        messages: [
          {
            value: JSON.stringify({
              transactionExternalId: 'test-id',
              transactionStatus: { name: TransactionStatesConstant.rejected },
              value: 8000
            })
          }
        ]
      });
    });

   it('should handle errors during message processing', async () => {
      const mockMessage: KafkaMessage = {
        key: null,
        value: Buffer.from('invalid-json'),
        timestamp: Date.now().toString(),
        attributes: 0,
        offset: '0',
        headers: {}
      };

      const inputKafka = {
        topic: TransactionTopicsConstant.TransactionCreated,
        partition: 0,
        message: mockMessage,
        heartbeat: jest.fn().mockResolvedValue(undefined),
        pause: jest.fn()
      };

      (consumer.run as jest.Mock).mockImplementationOnce(async (config: any) => {
        if (config.eachMessage) {
          await config.eachMessage(inputKafka);
        }
      });

      console.log = jest.fn();

      await runConsumer();

      expect(console.log).toHaveBeenCalledWith(
        '*****************err',
        expect.any(SyntaxError)
      );
    });
  });

  describe('disconnectConsumer', () => {
    it('should disconnect the consumer', async () => {
      await disconnectConsumer();

      expect(consumer.disconnect).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith('Disconnected from consumer');
    });
  });
});
