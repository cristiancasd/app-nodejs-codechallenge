import {
  TransactionStatesConstant,
  TransactionTopicsConstant,
  TransactionTypesNamesConstant
} from '../../../../core';
import { BrokerValue, TransactionEntity } from '../../../../feature/domain';

describe('BrokerValue', () => {
  it('should create a BrokerValue instance with TransactionCreated topic', () => {
    // Arrange
    const transactionEntity: TransactionEntity = {
      transactionStatus: { name: TransactionStatesConstant.pending },
      createdAt: new Date(),
      transactionExternalId: '',
      transactionType: { name: TransactionTypesNamesConstant.PagosProgramados },
      value: 1
    };

    // Act
    const brokerValue = new BrokerValue(transactionEntity);

    // Assert
    expect(brokerValue.topic).toBe(
      TransactionTopicsConstant.TransactionCreated
    );
    expect(brokerValue.message).toBe(transactionEntity);
  });

  it('should create a BrokerValue instance with TransactionEdited topic', () => {
    // Arrange
    const transactionEntity: TransactionEntity = {
      transactionStatus: { name: TransactionStatesConstant.approved },
      createdAt: new Date(),
      transactionExternalId: '',
      transactionType: { name: TransactionTypesNamesConstant.PagosProgramados },
      value: 1
    };

    // Act
    const brokerValue = new BrokerValue(transactionEntity);

    // Assert
    expect(brokerValue.topic).toBe(TransactionTopicsConstant.TransactionEdited);
    expect(brokerValue.message).toBe(transactionEntity);
  });
});
