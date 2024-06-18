import {
  TransactionStatesConstant,
  TransactionTypesConstant,
  mapTransferTypeIdToTransactionTypeName
} from '../../../core';
import {
  TransactionEntity,
  TransactionStatusEntity,
  TransactionTypeEntity
} from '../entities/transaction.entity';

export class TransactionValue implements TransactionEntity {
  transactionExternalId: string;
  transactionStatus: TransactionStatusEntity;
  transactionType: TransactionTypeEntity;
  value: number;
  createdAt: Date;

  constructor({
    transactionExternalId,
    transactionStatus,
    transactionTypeId,
    value,
    createdAt
  }: {
    transactionExternalId: string;
    transactionStatus: TransactionStatesConstant;
    transactionTypeId: TransactionTypesConstant;
    value: number;
    createdAt: Date;
  }) {
    this.transactionExternalId = transactionExternalId;
    this.transactionStatus = { name: transactionStatus };
    this.transactionType = {
      name: mapTransferTypeIdToTransactionTypeName(transactionTypeId)
    };
    this.value = value;
    this.createdAt = createdAt;
  }
}
