import {
  TransactionStatesConstant,
  TransactionTypesNamesConstant
} from '../core';

export interface TransactionBrokerEntity {
  transactionExternalId: string;
  transactionStatus: TransactionStatusEntity;
  value: number;
}

export interface TransactionStatusEntity {
  name: TransactionStatesConstant;
}

export interface TransactionTypeEntity {
  name: TransactionTypesNamesConstant;
}
