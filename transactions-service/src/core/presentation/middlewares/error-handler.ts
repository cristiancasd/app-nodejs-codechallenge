import { Request, Response, NextFunction } from 'express';
import { CustomError, somethingWrongMessage } from '../..';

// error handler
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  res.status(500).send({
    errors: [{ message: somethingWrongMessage }]
  });
};
