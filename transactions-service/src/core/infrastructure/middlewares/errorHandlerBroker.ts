import { QueryFailedError } from 'typeorm';

import {
  CustomError,
  DataBaseError,
  ServerError,
  codeDbError,
  codeDbErrorDuplicated,
  duplicatedDataMessage
} from '../..';

// Error handler respository typeORM
export const errorHandlerBroker = (
  target: any,
  key: string,
  descriptor: PropertyDescriptor
) => {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    try {
      return await originalMethod.apply(this, args);
    } catch (error) {
      throw new ServerError();
    }
  };
  return descriptor;
};
