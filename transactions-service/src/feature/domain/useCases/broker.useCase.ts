import { BrokerEntity } from '../entities/broker.entity';
import { TransactionEntity } from '../entities/transaction.entity';

export interface BrokerUseCaseInterface {
  sendMessageBroker(sendMessage: TransactionEntity): Promise<BrokerEntity>;
}
