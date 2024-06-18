import { errorHandlerUseCase } from '../../core';
import {
  BrokerEntity,
  BrokerRepositoryInterface,
  BrokerUseCaseInterface,
  BrokerValue,
  TransactionEntity
} from '../domain';

export class BrokerUseCaseImpl implements BrokerUseCaseInterface {
  constructor(private readonly _brokerRepository: BrokerRepositoryInterface) {}

  @errorHandlerUseCase
  async sendMessageBroker(data: TransactionEntity): Promise<BrokerEntity> {
    const dataBroker = new BrokerValue(data);
    return await this._brokerRepository.sendMessageBroker(dataBroker);
  }
}
