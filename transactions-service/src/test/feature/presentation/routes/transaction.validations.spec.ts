import { validateCreateTransactionBody } from '../../../../feature/presentation/routes/transaction.validations';
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { TransactionTypesConstant } from '../../../../core';

const mockRequest = (body: any): Partial<Request> => ({
  body
});

const mockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext: NextFunction = jest.fn();

const runValidation = async (
  req: Partial<Request>,
  res: Partial<Response>,
  next: NextFunction
) => {
  for (const validation of validateCreateTransactionBody) {
    await validation.run(req as Request);
  }
  validationResult(req as Request).throw();
};

describe('Transaction Validations', () => {
  it('should pass validation with valid data', async () => {
    const req = mockRequest({
      accountExternalIdDebit: 'debit-id',
      accountExternalIdCredit: 'credit-id',
      tranferTypeId: TransactionTypesConstant.PagosProgramados,
      value: 100
    });
    const res = mockResponse();

    await expect(runValidation(req, res, mockNext)).resolves.not.toThrow();
  });

  it('should fail if accountExternalIdDebit and accountExternalIdCredit are the same', async () => {
    const req = mockRequest({
      accountExternalIdDebit: 'same-id',
      accountExternalIdCredit: 'same-id',
      tranferTypeId: TransactionTypesConstant.PagosProgramados,
      value: 100
    });
    const res = mockResponse();
    await expect(runValidation(req, res, mockNext)).rejects.toThrow();
  });

  it('should fail if accountExternalIdDebit is not a string', async () => {
    const req = mockRequest({
      accountExternalIdDebit: 123,
      accountExternalIdCredit: 'credit-id',
      tranferTypeId: TransactionTypesConstant.PagosProgramados,
      value: 100
    });
    const res = mockResponse();

    await expect(runValidation(req, res, mockNext)).rejects.toThrow();
  });

  it('should fail if accountExternalIdCredit is not a string', async () => {
    const req = mockRequest({
      accountExternalIdDebit: 'debit-id',
      accountExternalIdCredit: 123,
      tranferTypeId: TransactionTypesConstant.PagosProgramados,
      value: 100
    });
    const res = mockResponse();

    await expect(runValidation(req, res, mockNext)).rejects.toThrow();
  });

  it('should fail if tranferTypeId is not an integer', async () => {
    const req = mockRequest({
      accountExternalIdDebit: 'debit-id',
      accountExternalIdCredit: 'credit-id',
      tranferTypeId: 'not-an-integer',
      value: 100
    });
    const res = mockResponse();

    await expect(runValidation(req, res, mockNext)).rejects.toThrow();
  });

  it('should fail if tranferTypeId is invalid', async () => {
    const req = mockRequest({
      accountExternalIdDebit: 'debit-id',
      accountExternalIdCredit: 'credit-id',
      tranferTypeId: 999, // Assuming 999 is not a valid transaction type
      value: 100
    });
    const res = mockResponse();

    await expect(runValidation(req, res, mockNext)).rejects.toThrow();
  });

  it('should fail if value is not an integer', async () => {
    const req = mockRequest({
      accountExternalIdDebit: 'debit-id',
      accountExternalIdCredit: 'credit-id',
      tranferTypeId: TransactionTypesConstant.PagosProgramados,
      value: 'not-an-integer'
    });
    const res = mockResponse();

    await expect(runValidation(req, res, mockNext)).rejects.toThrow();
  });
});
