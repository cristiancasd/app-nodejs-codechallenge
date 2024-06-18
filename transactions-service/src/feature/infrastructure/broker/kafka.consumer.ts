//import  {configureDependencies}  from "../../presentation/config";

import { KafkaMessage } from 'kafkajs';
import { TransactionTopicsConstant } from '../../../core';
import { TransactionEntity } from '../../domain';
import configureDependencies from '../../presentation/config/configureDependencies';
import { kafka } from './kafka.client';

// Obtiene las dependencias configuradas, en este caso solo necesitamos el repositorio de transacciones
const { transactionRepository } = configureDependencies();

// Configura el consumidor Kafka para este servicio de transacciones
const consumer = kafka.consumer({
  groupId: 'transaction-service'
});

// Función para desconectar el consumidor Kafka
export async function disconnectConsumer() {
  await consumer.disconnect();
  console.log('Disconnected from consumer');
}

// Definición de la estructura de entrada para los mensajes Kafka
interface InputKafka {
  topic: string;
  partition: number;
  message: KafkaMessage;
}

// Array que contiene los temas a los que se suscribe el consumidor Kafka
const topics = [TransactionTopicsConstant.TransactionProcessed];

// Función para conectar el consumidor Kafka
export async function connectConsumer() {
  await consumer.connect();

  // Itera sobre todos los temas definidos para suscribirse a ellos
  for (let i = 0; i < topics.length; i++) {
    console.log('subscribing topic: ', topics[i]);

    // Suscribe el consumidor Kafka al tema actual con la opción de leer desde el principio
    await consumer.subscribe({
      topic: topics[i],
      fromBeginning: true
    });
  }

  // Ejecuta el consumidor Kafka para escuchar mensajes en los temas suscritos
  await consumer.run({
    eachMessage: async (input: InputKafka) => {
      try {
        if (!input.message || !input.message.value) return;

        // Parsea el mensaje Kafka recibido a una entidad de transacción
        const data = JSON.parse(input.message.value.toString());
        console.log('mensaje recibido de kafka');

        // Actualiza la transacción en la base de datos usando el repositorio de transacciones
        await transactionRepository.editTransaction(
          data.transactionExternalId,
          data.transactionStatus.name
        );
      } catch (err) {
        console.log('error transaction consumer: ', err);
      }
    }
  });
}
