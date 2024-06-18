import { TransactionStatesConstant } from '../../../core';
import { TransactionEntity } from '../entities/transaction.entity';
import { TransactionRequestEntity } from '../entities/transactionRequest.entity';

export interface TransactionRepositoryInterface {
  createTransaction(data: TransactionRequestEntity): Promise<TransactionEntity>;
  editTransaction(
    transactionId: string,
    state: TransactionStatesConstant
  ): Promise<TransactionEntity>;
  findTransaction(id: string): Promise<TransactionEntity>;
  getUserTransactions(userId: string): Promise<TransactionEntity[]>;
}
