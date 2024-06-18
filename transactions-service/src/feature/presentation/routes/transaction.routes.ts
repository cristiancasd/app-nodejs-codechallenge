import express from 'express';
import { validateRequest, validateUUIDParam } from '../../../core';
import { validateCreateTransactionBody } from './transaction.validations';
import configureDependencies from '../config/configureDependencies';

const { transactionCtrl } = configureDependencies();
const transactionRoutes = express.Router();

/// Create Transaction
transactionRoutes.post(
  `/create`,
  validateCreateTransactionBody,
  validateRequest,
  transactionCtrl.insertCtrl
);

/// Find transaction by UID
transactionRoutes.get(
  '/find/id/:transactionId',
  [validateUUIDParam('transactionId')],
  validateRequest,
  transactionCtrl.findCtrl
);

/// Find transaction by user Tx ID
transactionRoutes.get(
  '/find/user/id/:transactionId',
  [],
  validateRequest,
  transactionCtrl.findUserTransactionsCtrl
);

export { transactionRoutes };
