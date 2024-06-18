import { TransactionStatesConstant, errorHandlerUseCase } from '../../core';

import {
  TransactionEntity,
  TransactionRepositoryInterface,
  TransactionRequestEntity,
  TransactionUseCaseInterface
} from '../domain';

export class TransactionUseCaseImpl implements TransactionUseCaseInterface {
  constructor(
    private readonly _TransactionRepository: TransactionRepositoryInterface
  ) {}

  @errorHandlerUseCase
  async createTransaction(
    input: TransactionRequestEntity
  ): Promise<TransactionEntity> {
    return await this._TransactionRepository.createTransaction(input);
  }

  @errorHandlerUseCase
  async editTransaction(
    transactionId: string,
    state: TransactionStatesConstant
  ): Promise<TransactionEntity> {
    return await this._TransactionRepository.editTransaction(
      transactionId,
      state
    );
  }

  @errorHandlerUseCase
  async findTransaction(id: string): Promise<TransactionEntity> {
    return await this._TransactionRepository.findTransaction(id);
  }

  @errorHandlerUseCase
  async getUserTransactions(userId: string): Promise<TransactionEntity[]> {
    return await this._TransactionRepository.getUserTransactions(userId);
  }
}
