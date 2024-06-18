import { Kafka } from 'kafkajs';

const hostBroker= process.env.KAFKA_BROKER_URL || 'localhost:9092';
console.log('host broker to use ', hostBroker);
const brokers = [hostBroker];


export const kafka = new Kafka({
  clientId: 'transaction-service',
  brokers
});
