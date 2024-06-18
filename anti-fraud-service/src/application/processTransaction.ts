import { TransactionBrokerEntity } from '../domain/transaction.entity';

export const processTransaction = (transaction: TransactionBrokerEntity): boolean => {
  return transaction.value>0 &&  transaction.value <= 1000;
};
