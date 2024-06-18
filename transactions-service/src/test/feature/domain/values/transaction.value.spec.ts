import {
  TransactionStatesConstant,
  TransactionTypesConstant,
  mapTransferTypeIdToTransactionTypeName
} from '../../../../core';
import { TransactionValue } from '../../../../feature/domain';

describe('TransactionValue', () => {
  it('should create a TransactionValue instance with correct values', () => {
    // Arrange
    const transactionExternalId = '123456789';
    const transactionStatus = TransactionStatesConstant.pending;
    const transactionTypeId = TransactionTypesConstant.PagosProgramados;
    const value = 100;
    const createdAt = new Date();

    // Act
    const transactionValue = new TransactionValue({
      transactionExternalId,
      transactionStatus,
      transactionTypeId,
      value,
      createdAt
    });

    // Assert
    expect(transactionValue.transactionExternalId).toBe(transactionExternalId);
    expect(transactionValue.transactionStatus.name).toBe(transactionStatus);
    expect(transactionValue.transactionType.name).toBe(
      mapTransferTypeIdToTransactionTypeName(transactionTypeId)
    );
    expect(transactionValue.value).toBe(value);
    expect(transactionValue.createdAt).toBe(createdAt);
  });

  it('should create a TransactionValue instance with default status and type', () => {
    // Arrange
    const transactionExternalId = '987654321';
    const transactionStatus = TransactionStatesConstant.approved;
    const transactionTypeId = TransactionTypesConstant.PagosProgramados;
    const value = 200;
    const createdAt = new Date();

    // Act
    const transactionValue = new TransactionValue({
      transactionExternalId,
      transactionStatus,
      transactionTypeId,
      value,
      createdAt
    });

    // Assert
    expect(transactionValue.transactionExternalId).toBe(transactionExternalId);
    expect(transactionValue.transactionStatus.name).toBe(transactionStatus);
    expect(transactionValue.transactionType.name).toBe(
      mapTransferTypeIdToTransactionTypeName(transactionTypeId)
    );
    expect(transactionValue.value).toBe(value);
    expect(transactionValue.createdAt).toBe(createdAt);
  });
});
