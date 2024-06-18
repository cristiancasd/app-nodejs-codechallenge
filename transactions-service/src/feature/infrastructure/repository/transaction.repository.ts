import {
  NotFoundError,
  TransactionStatesConstant,
  errorHandlerTypeOrm,
  errorTransactionNotFound
} from '../../../core';

import { connectDB } from '../database';
import {
  TransactionEntity,
  TransactionRepositoryInterface,
  TransactionRequestEntity,
  TransactionValue
} from '../../domain';
import { TransactionModel } from '../models/transaction.dto';

export class TransactionRepositoryImpl
  implements TransactionRepositoryInterface {
  constructor() { }

  @errorHandlerTypeOrm
  async createTransaction(
    data: TransactionRequestEntity
  ): Promise<TransactionEntity> {
    console.log('creando transacción en DB');
    const transactionRepository = connectDB.getRepository(TransactionModel);
    const newTransaction = transactionRepository.create(data);
    const transactionSaved = await transactionRepository.save(newTransaction);
    console.log('transacción creada');

    return new TransactionValue({
      ...transactionSaved,
      transactionTypeId: transactionSaved.tranferTypeId,
      createdAt: transactionSaved.createdAt ?? new Date()
    });
  }

  @errorHandlerTypeOrm
  async editTransaction(
    transactionId: string,
    state: TransactionStatesConstant
  ): Promise<TransactionEntity> {
    console.log('editando transacción en DB');
    const transactionRepository = connectDB.getRepository(TransactionModel);
    const transactionFound = await transactionRepository.findOneBy({
      transactionExternalId: transactionId
    });

    if (!transactionFound) throw new NotFoundError(errorTransactionNotFound);
    const transactionSaved = await transactionRepository.save({
      ...transactionFound,
      transactionStatus: state
    });

    console.log('transacción editada');

    return new TransactionValue({
      ...transactionSaved,
      transactionTypeId: transactionSaved.tranferTypeId,
      createdAt: transactionSaved.createdAt ?? new Date()
    });
  }

  @errorHandlerTypeOrm
  async findTransaction(id: string): Promise<TransactionEntity> {
    console.log('buscando transacción en DB');
    const transactionRepository = connectDB.getRepository(TransactionModel);
    const transactionFound = await transactionRepository.findOneBy({
      transactionExternalId: id
    });

    if (transactionFound) {
      console.log('transacción encontrada');
      return new TransactionValue({
        ...transactionFound,
        transactionTypeId: transactionFound.tranferTypeId,
        createdAt: transactionFound.createdAt ?? new Date()
      });
    }
    throw new NotFoundError(errorTransactionNotFound);
  }

  @errorHandlerTypeOrm
  async getUserTransactions(userId: string): Promise<TransactionEntity[]> {
    console.log('buscando las transacción en DB');
    const transactionRepository = connectDB.getRepository(TransactionModel);

    const transactionsFound = await transactionRepository.find({
      where: [
        { accountExternalIdCredit: userId },
        { accountExternalIdDebit: userId },
      ],
    })


    console.log('transacciones encontradas');

    const transactions = transactionsFound.map((tx) => {
      return new TransactionValue({
        ...tx,
        transactionTypeId: tx.tranferTypeId,
        createdAt: tx.createdAt ?? new Date()
      });
    })
    return transactions;
  }
}
