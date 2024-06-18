import { TransactionTopicsConstant } from '../core';

import { TransactionBrokerEntity } from './transaction.entity';

export interface BrokerEntity {
  topic: TransactionTopicsConstant;
  message: TransactionBrokerEntity;
}
