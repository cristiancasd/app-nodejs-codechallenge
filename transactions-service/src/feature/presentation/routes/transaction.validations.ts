import { body, ValidationChain, CustomValidator } from 'express-validator';
import { TransactionTypesConstant } from '../../../core';

const validTransactionTypeIds = Object.values(TransactionTypesConstant).filter(
  (value) => typeof value === 'number'
);

const accountIdsDifferent: CustomValidator = (value, { req }) => {
  if (value === req.body.accountExternalIdCredit) {
    throw new Error(
      'accountExternalIdDebit and accountExternalIdCredit must be different'
    );
  }
  return true;
};

export const validateCreateTransactionBody: ValidationChain[] = [
  body('accountExternalIdDebit')
    .isString()
    .withMessage('accountExternalIdDebit must be a string')
    .custom(accountIdsDifferent),
  body('accountExternalIdCredit')
    .isString()
    .withMessage('accountExternalIdCredit must be a string'),
  body('tranferTypeId').isInt().withMessage('tranferTypeId must be an integer'),
  body('tranferTypeId')
    .isIn(validTransactionTypeIds)
    .withMessage('tranferTypeId is invalid'),
  body('value').isInt().withMessage('value must be an integer')
];
