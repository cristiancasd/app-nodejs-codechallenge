import {
  TransactionStatesConstant,
  TransactionTypesNamesConstant
} from '../../../core';

export interface TransactionEntity {
  transactionExternalId: string;
  transactionStatus: TransactionStatusEntity;
  transactionType: TransactionTypeEntity;
  value: number;
  createdAt: Date;
}

export interface TransactionStatusEntity {
  name: TransactionStatesConstant;
}

export interface TransactionTypeEntity {
  name: TransactionTypesNamesConstant;
}
