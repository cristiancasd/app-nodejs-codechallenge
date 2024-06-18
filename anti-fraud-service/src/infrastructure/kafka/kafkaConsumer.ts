import { KafkaMessage } from 'kafkajs';
import { processTransaction } from '../../application/processTransaction';
import { kafkaProducer } from './kafkaProducer';
import {
  TransactionStatesConstant,
  TransactionTopicsConstant
} from '../../core';
import { kafka } from './kafkaClient';
import { TransactionBrokerEntity } from '../../domain/transaction.entity';

export const consumer = kafka.consumer({
  groupId: 'anti-fraud-service'
});

export async function disconnectConsumer() {
  await consumer.disconnect();
  console.log('Disconnected from consumer');
}

interface InputKafka {
  topic: string;
  partition: number;
  message: KafkaMessage;
}

export const runConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({
    topic: TransactionTopicsConstant.TransactionCreated,
    fromBeginning: true
  });

  await consumer.run({
    eachMessage: async (input: InputKafka) => {
      try {
        console.log('.................input', input.message);

        if (!input.message || !input.message.value) return;

        const transaction: TransactionBrokerEntity = JSON.parse(
          input.message.value.toString()
        );
        console.log('.................brokerEntity', transaction);

        const isApproved = processTransaction(transaction);

        console.log('.................isApproved', isApproved);

        transaction.transactionStatus['name'] = isApproved
          ? TransactionStatesConstant.approved
          : TransactionStatesConstant.rejected;

        await kafkaProducer.send({
          topic: TransactionTopicsConstant.TransactionProcessed,
          messages: [{ value: JSON.stringify(transaction) }]
        });

        console.log('Processed Transaction:', transaction);
      } catch (err) {
        console.log('*****************err', err);
      }
    }
  });
};
