import { TransactionTopicsConstant } from '../../../core';
import { TransactionEntity } from './transaction.entity';

export interface BrokerEntity {
  topic: TransactionTopicsConstant;
  message: TransactionEntity;
}
