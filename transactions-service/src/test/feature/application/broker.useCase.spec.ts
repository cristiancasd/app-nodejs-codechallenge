import {
  ServerError,
  TransactionStatesConstant,
  TransactionTopicsConstant,
  TransactionTypesNamesConstant
} from '../../../core';
import { BrokerUseCaseImpl } from '../../../feature';
import {
  BrokerEntity,
  BrokerRepositoryInterface,
  TransactionEntity
} from '../../../feature/domain';

describe('BrokerUseCaseImpl', () => {
  let brokerUseCase: BrokerUseCaseImpl;
  let mockBrokerRepository: BrokerRepositoryInterface;

  const transactionEntityMock: TransactionEntity = {
    transactionStatus: { name: TransactionStatesConstant.approved },
    createdAt: new Date(),
    transactionExternalId: 'transactionExternalIdTest',
    transactionType: { name: TransactionTypesNamesConstant.PagosProgramados },
    value: 1
  };

  beforeEach(() => {
    mockBrokerRepository = {
      async sendMessageBroker(data: BrokerEntity): Promise<BrokerEntity> {
        return {
          message: transactionEntityMock,
          topic: TransactionTopicsConstant.TransactionEdited
        };
      }
    };

    brokerUseCase = new BrokerUseCaseImpl(mockBrokerRepository);
  });

  it('should send a message via broker', async () => {
    // Arrange
    const mockTransactionData: TransactionEntity = {
      transactionExternalId: transactionEntityMock.transactionExternalId,
      transactionType: { name: TransactionTypesNamesConstant.PagosProgramados },
      transactionStatus: { name: TransactionStatesConstant.approved },
      value: 100,
      createdAt: new Date()
    };

    // Act
    const result = await brokerUseCase.sendMessageBroker(mockTransactionData);
    // Assert
    expect(result).toBeDefined();
    expect(result.message.transactionExternalId).toEqual(
      transactionEntityMock.transactionExternalId
    );
    expect(result.message.transactionStatus.name).toEqual(
      transactionEntityMock.transactionStatus.name
    );
  });

  it('should handle errors from broker repository', async () => {
    // Arrange
    const mockError = new Error('Failed to send message');
    mockBrokerRepository.sendMessageBroker = jest
      .fn()
      .mockRejectedValue(mockError);

    // Act & Assert
    await expect(
      brokerUseCase.sendMessageBroker({} as TransactionEntity)
    ).rejects.toBeInstanceOf(ServerError);
  });
});
