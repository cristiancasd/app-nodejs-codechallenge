import { Kafka } from 'kafkajs';

const brokers = ['localhost:9092'];

export const kafka = new Kafka({
  clientId: 'anti-fraud-service',
  brokers
});
