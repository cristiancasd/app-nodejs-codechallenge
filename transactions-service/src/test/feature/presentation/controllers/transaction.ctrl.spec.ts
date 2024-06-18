import { Request, Response } from 'express';
import {
  TransactionStatesConstant,
  TransactionTypesNamesConstant
} from '../../../../core';
import { TransactionController } from '../../../../feature';
import {
  BrokerUseCaseInterface,
  TransactionEntity,
  TransactionUseCaseInterface
} from '../../../../feature/domain';

describe('TransactionController', () => {
  let transactionController: TransactionController;
  let mockTransactionUseCase: TransactionUseCaseInterface;
  let mockBrokerUseCase: BrokerUseCaseInterface;
  let req: Partial<Request>;
  let res: Partial<Response>;

  const mockTransaction: TransactionEntity = {
    transactionExternalId: 'id',
    transactionType: { name: TransactionTypesNamesConstant.PagosProgramados },
    transactionStatus: { name: TransactionStatesConstant.approved },
    value: 100,
    createdAt: new Date()
  };

  beforeEach(() => {
    mockTransactionUseCase = {
      createTransaction: jest.fn(),
      editTransaction: jest.fn(),
      findTransaction: jest.fn(),
      getUserTransactions: jest.fn(),
    };

    mockBrokerUseCase = {
      sendMessageBroker: jest.fn()
    };

    transactionController = new TransactionController(
      mockTransactionUseCase,
      mockBrokerUseCase
    );

    req = {
      body: {},
      params: {}
    };

    res = {
      status: jest.fn().mockReturnThis() as unknown as (
        code: number
      ) => Response,
      send: jest.fn() as unknown as (body?: any) => Response
    };
  });

  describe('insertCtrl', () => {
    it('should create a transaction and send a broker message', async () => {
      // Arrange

      req.body = {
        accountExternalIdDebit: 'debit-id',
        accountExternalIdCredit: 'credit-id',
        tranferTypeId: 1,
        value: 100
      };

      (mockTransactionUseCase.createTransaction as jest.Mock).mockResolvedValue(
        mockTransaction
      );

      // Act
      await transactionController.insertCtrl(req as Request, res as Response);

      // Assert
      expect(mockTransactionUseCase.createTransaction).toHaveBeenCalledWith(
        req.body
      );
      expect(mockBrokerUseCase.sendMessageBroker).toHaveBeenCalledWith(
        mockTransaction
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(mockTransaction);
    });
  });

  describe('findCtrl', () => {
    it('should find a transaction and send a broker message', async () => {
      // Arrange
      req.params = { transactionId: 'test-id' };

      (mockTransactionUseCase.findTransaction as jest.Mock).mockResolvedValue(
        mockTransaction
      );

      // Act
      await transactionController.findCtrl(req as Request, res as Response);

      // Assert
      expect(mockTransactionUseCase.findTransaction).toHaveBeenCalledWith(
        'test-id'
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(mockTransaction);
    });
  });
});
