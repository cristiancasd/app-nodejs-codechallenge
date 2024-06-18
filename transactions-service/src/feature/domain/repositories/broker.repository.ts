import { BrokerEntity } from '../entities/broker.entity';

// Interfaz del repositorio.
export interface BrokerRepositoryInterface {
  sendMessageBroker(sendMessage: BrokerEntity): Promise<BrokerEntity>;
}
