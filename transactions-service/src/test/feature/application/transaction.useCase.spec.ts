import { TransactionUseCaseImpl } from '../../../feature/';
import {
  TransactionEntity,
  TransactionRepositoryInterface,
  TransactionRequestEntity
} from '../../../feature/domain';
import {
  NotFoundError,
  ServerError,
  TransactionStatesConstant,
  TransactionTypesNamesConstant
} from '../../../core';

describe('TransactionUseCaseImpl', () => {
  let transactionUseCase: TransactionUseCaseImpl;
  let mockTransactionRepository: TransactionRepositoryInterface;

  const mockTransactionEntity: TransactionEntity = {
    transactionExternalId: 'transaction-id',
    transactionStatus: { name: TransactionStatesConstant.pending },
    transactionType: { name: TransactionTypesNamesConstant.PagosProgramados },
    value: 100,
    createdAt: new Date()
  };

  beforeEach(() => {
    mockTransactionRepository = {
      createTransaction: jest.fn(),
      editTransaction: jest.fn(),
      findTransaction: jest.fn(),
      getUserTransactions: jest.fn(),
    };

    transactionUseCase = new TransactionUseCaseImpl(mockTransactionRepository);
  });

  describe('createTransaction', () => {
    it('should create a transaction', async () => {
      // Arrange
      const mockTransactionRequest: TransactionRequestEntity = {
        accountExternalIdDebit: 'debit-account-id',
        accountExternalIdCredit: 'credit-account-id',
        tranferTypeId: 1,
        value: 100
      };

      (
        mockTransactionRepository.createTransaction as jest.Mock
      ).mockResolvedValue(mockTransactionEntity);

      // Act
      const result = await transactionUseCase.createTransaction(
        mockTransactionRequest
      );

      // Assert
      expect(mockTransactionRepository.createTransaction).toHaveBeenCalledWith(
        mockTransactionRequest
      );
      expect(result).toEqual(mockTransactionEntity);
    });
  });

  describe('editTransaction', () => {
    it('should edit a transaction', async () => {
      // Arrange
      const transactionId = 'transaction-id';
      const state = TransactionStatesConstant.pending;

      (
        mockTransactionRepository.editTransaction as jest.Mock
      ).mockResolvedValue(mockTransactionEntity);

      // Act
      const result = await transactionUseCase.editTransaction(
        transactionId,
        state
      );

      // Assert
      expect(mockTransactionRepository.editTransaction).toHaveBeenCalledWith(
        transactionId,
        state
      );
      expect(result).toEqual(mockTransactionEntity);
    });

    it('should throw a ServerError when an uncknown Error ocurred', async () => {
      // Arrange
      const transactionId = 'transaction-id';
      const state = TransactionStatesConstant.pending;

      (
        mockTransactionRepository.editTransaction as jest.Mock
      ).mockRejectedValue(new Error(''));

      // Act
      await expect(
        transactionUseCase.editTransaction(
          'id',
          TransactionStatesConstant.approved
        )
      ).rejects.toBeInstanceOf(ServerError);
    });

    it('should throw a NotFoundError when the transaction ID dont exist', async () => {
      // Arrange
      const transactionId = 'transaction-id';
      const state = TransactionStatesConstant.pending;

      (
        mockTransactionRepository.editTransaction as jest.Mock
      ).mockRejectedValue(new NotFoundError(''));

      // Act
      await expect(
        transactionUseCase.editTransaction(
          'id',
          TransactionStatesConstant.approved
        )
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe('findTransaction', () => {
    it('should find a transaction', async () => {
      // Arrange
      const transactionId = 'transaction-id';
      (
        mockTransactionRepository.findTransaction as jest.Mock
      ).mockResolvedValue(mockTransactionEntity);

      // Act
      const result = await transactionUseCase.findTransaction(transactionId);

      // Assert
      expect(mockTransactionRepository.findTransaction).toHaveBeenCalledWith(
        transactionId
      );
      expect(result).toEqual(mockTransactionEntity);
    });

    it('should throw a ServerError when an uncknown Error ocurred', async () => {
      // Arrange
      const transactionId = 'transaction-id';
      const state = TransactionStatesConstant.pending;

      (
        mockTransactionRepository.findTransaction as jest.Mock
      ).mockRejectedValue(new Error(''));

      // Act
      await expect(
        transactionUseCase.findTransaction('id')
      ).rejects.toBeInstanceOf(ServerError);
    });

    it('should throw a NotFoundError when the transaction ID dont exist', async () => {
      // Arrange
      const transactionId = 'transaction-id';
      const state = TransactionStatesConstant.pending;

      (
        mockTransactionRepository.findTransaction as jest.Mock
      ).mockRejectedValue(new NotFoundError(''));

      // Act
      await expect(
        transactionUseCase.findTransaction('id')
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});
