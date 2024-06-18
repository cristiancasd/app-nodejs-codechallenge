import { kafka } from './kafkaClient';

export const kafkaProducer = kafka.producer();

export const connectProducer = async () => {
  await kafkaProducer.connect();
};

export const disconnectProducer = async () => {
  await kafkaProducer.disconnect();
};
