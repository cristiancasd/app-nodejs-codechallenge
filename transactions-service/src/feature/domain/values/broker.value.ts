import {
  TransactionStatesConstant,
  TransactionTopicsConstant
} from '../../../core';
import { BrokerEntity } from '../entities/broker.entity';
import { TransactionEntity } from '../entities/transaction.entity';

export class BrokerValue implements BrokerEntity {
  topic: TransactionTopicsConstant;
  message: TransactionEntity;

  constructor(message: TransactionEntity) {
    const topic =
      message.transactionStatus.name == TransactionStatesConstant.pending
        ? TransactionTopicsConstant.TransactionCreated
        : TransactionTopicsConstant.TransactionEdited;

    this.topic = topic;
    this.message = message;
  }
}
