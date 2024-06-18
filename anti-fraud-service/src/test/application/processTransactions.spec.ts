
import { processTransaction } from '../../application/processTransaction';
import { TransactionStatesConstant } from '../../core';
import { TransactionBrokerEntity } from '../../domain/transaction.entity';

describe('processTransaction', () => {
    it('should return true when transaction value is less than or equal to 1000', () => {
        const transaction: TransactionBrokerEntity = {
            transactionStatus: { name: TransactionStatesConstant.pending },
            transactionExternalId: 'test-id-1',
            value: 1000
        };

        const result = processTransaction(transaction);

        expect(result).toBe(true);
    });

    it('should return false when transaction value is greater than 1000', () => {
        const transaction: TransactionBrokerEntity = {
            transactionStatus: { name: TransactionStatesConstant.pending },

            transactionExternalId: 'test-id-2',
            value: 1500
        };

        const result = processTransaction(transaction);

        expect(result).toBe(false);
    });

    it('should return true when transaction value is exactly 1000', () => {
        const transaction: TransactionBrokerEntity = {
            transactionStatus: { name: TransactionStatesConstant.pending },

            transactionExternalId: 'test-id-3',
            value: 1000
        };

        const result = processTransaction(transaction);

        expect(result).toBe(true);
    });

    it('should return false when transaction value is negative', () => {
        const transaction: TransactionBrokerEntity = {
            transactionStatus: { name: TransactionStatesConstant.pending },

            transactionExternalId: 'test-id-4',
            value: -500
        };

        const result = processTransaction(transaction);

        expect(result).toBe(false);
    });
});
