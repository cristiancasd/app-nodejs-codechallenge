import {
  NotFoundError,
  TransactionStatesConstant,
  mapTransferTypeIdToTransactionTypeName,
  ServerError
} from '../../../../core';

import { TransactionRepositoryImpl } from '../../../../feature';
import {
  TransactionEntity,
  TransactionRequestEntity
} from '../../../../feature/domain';
import { connectDB } from '../../../../feature/infrastructure/database';
import { TransactionModel } from '../../../../feature/infrastructure/models/transaction.dto';

jest.mock(
  '../../../../feature/infrastructure/database/typeorm.connection.ts',
  () => ({
    connectDB: {
      getRepository: jest.fn()
    }
  })
);

describe('TransactionRepositoryImpl', () => {
  describe('createTransaction', () => {
    it('should create a new transaction in memory', async () => {
      const mockTransactionModel = {
        create: jest.fn().mockImplementation((data) => ({
          ...data,
          transactionExternalId: 'generatedId',
          tranferTypeId: data.tranferTypeId,
          createdAt: new Date()
        })),
        save: jest.fn().mockImplementation((transaction) => transaction)
      };

      (connectDB.getRepository as jest.Mock).mockReturnValue(
        mockTransactionModel
      );

      const repository = new TransactionRepositoryImpl();

      const testData: TransactionRequestEntity = {
        accountExternalIdDebit: 'debitAccountId',
        accountExternalIdCredit: 'creditAccountId',
        tranferTypeId: 1,
        value: 100
      };

      const createdTransaction = await repository.createTransaction(testData);

      expect(connectDB.getRepository).toHaveBeenCalledWith(expect.anything()); // Verificar que se llamó getRepository con cualquier argumento
      expect(mockTransactionModel.create).toHaveBeenCalledWith(testData); // Verificar que se llamó create con los datos esperados
      expect(mockTransactionModel.save).toHaveBeenCalled(); // Verificar que se llamó save

      // Verificar que se devolvió una transacción con los datos esperados
      expect(createdTransaction).toHaveProperty(
        'transactionExternalId',
        'generatedId'
      );
      expect(createdTransaction).toHaveProperty('transactionStatus');
      expect(createdTransaction).toHaveProperty('transactionType');
      expect(createdTransaction).toHaveProperty('value', 100);
      expect(createdTransaction).toHaveProperty('createdAt');
    });

    it('should throw ServerError if error happened', async () => {
      const mockTransactionModel = {
        findOneBy: jest.fn().mockImplementation(() => new Error())
      };

      (connectDB.getRepository as jest.Mock).mockReturnValue(
        mockTransactionModel
      );

      const repository = new TransactionRepositoryImpl();

      const testData: TransactionRequestEntity = {
        accountExternalIdDebit: 'debitAccountId',
        accountExternalIdCredit: 'creditAccountId',
        tranferTypeId: 1,
        value: 100
      };

      // Verificar que createTransaction lance ServerError cuando el proceso fallé
      await expect(
        repository.createTransaction(testData)
      ).rejects.toBeInstanceOf(ServerError);
    });
  });

  describe('editTransaction', () => {
    it('should edit an existing transaction in memory', async () => {
      const mockTransactionModel = {
        findOneBy: jest.fn().mockImplementation(() => ({
          transactionExternalId: 'transactionId',
          accountExternalIdDebit: 'debitAccountId',
          accountExternalIdCredit: 'creditAccountId',
          tranferTypeId: 1,
          value: 100,
          transactionStatus: { name: 'pending' },
          createdAt: new Date()
        })),
        save: jest.fn().mockImplementation((updatedTransaction) => ({
          ...updatedTransaction,
          transactionStatus: TransactionStatesConstant.approved,
          updatedAt: new Date()
        }))
      };

      (connectDB.getRepository as jest.Mock).mockReturnValue(
        mockTransactionModel
      );

      const repository = new TransactionRepositoryImpl();

      const updatedTransaction = await repository.editTransaction(
        'transactionId',
        TransactionStatesConstant.approved
      );

      expect(connectDB.getRepository).toHaveBeenCalledWith(TransactionModel);
      expect(mockTransactionModel.findOneBy).toHaveBeenCalledWith({
        transactionExternalId: 'transactionId'
      });
      expect(mockTransactionModel.save).toHaveBeenCalled();

      expect(updatedTransaction).toHaveProperty(
        'transactionExternalId',
        'transactionId'
      );
      expect(updatedTransaction).toHaveProperty(
        'transactionStatus.name',
        TransactionStatesConstant.approved
      );
      expect(updatedTransaction).toHaveProperty(
        'transactionType.name',
        mapTransferTypeIdToTransactionTypeName(1)
      );
      expect(updatedTransaction).toHaveProperty('value', 100);
      expect(updatedTransaction).toHaveProperty('createdAt');
    });

    it('should throw NotFoundError if transaction is not found', async () => {
      const mockTransactionModel = {
        findOneBy: jest.fn().mockImplementation(() => null)
      };

      (connectDB.getRepository as jest.Mock).mockReturnValue(
        mockTransactionModel
      );

      const repository = new TransactionRepositoryImpl();

      // Verificar que editTransaction lance NotFoundError cuando la transacción no existe
      await expect(
        repository.editTransaction(
          'nonExistentId',
          TransactionStatesConstant.approved
        )
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe('findTransaction', () => {
    it('should find an existing transaction in memory', async () => {
      const mockTransactionModel = {
        findOneBy: jest.fn().mockImplementation(() => ({
          transactionExternalId: 'transactionId',
          accountExternalIdDebit: 'debitAccountId',
          accountExternalIdCredit: 'creditAccountId',
          tranferTypeId: 1,
          value: 100,
          transactionStatus: 'completed',
          createdAt: new Date()
        }))
      };

      (connectDB.getRepository as jest.Mock).mockReturnValue(
        mockTransactionModel
      );

      const repository = new TransactionRepositoryImpl();

      const foundTransaction = await repository.findTransaction(
        'transactionId'
      );

      expect(connectDB.getRepository).toHaveBeenCalledWith(expect.anything()); // Verificar que se llamó getRepository con cualquier argumento
      expect(mockTransactionModel.findOneBy).toHaveBeenCalledWith({
        transactionExternalId: 'transactionId'
      }); // Verificar que se llamó findOneBy con el ID correcto

      // Verificar que se devolvió la transacción encontrada con los datos esperados
      expect(foundTransaction).toHaveProperty(
        'transactionExternalId',
        'transactionId'
      );
      expect(foundTransaction).toHaveProperty('transactionStatus');
      expect(foundTransaction).toHaveProperty('transactionType');
      expect(foundTransaction).toHaveProperty('value', 100);
      expect(foundTransaction).toHaveProperty('createdAt');
    });

    it('should throw NotFoundError if transaction is not found', async () => {
      const mockTransactionModel = {
        findOneBy: jest.fn().mockImplementation(() => null)
      };

      (connectDB.getRepository as jest.Mock).mockReturnValue(
        mockTransactionModel
      );

      const repository = new TransactionRepositoryImpl();

      // Verificar que findTransaction lance NotFoundError cuando la transacción no existe
      await expect(
        repository.findTransaction('nonExistentId')
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});
