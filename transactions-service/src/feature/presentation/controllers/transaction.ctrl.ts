import { Request, Response } from 'express';
import {
  BrokerUseCaseInterface,
  TransactionUseCaseInterface
} from '../../domain';

export class TransactionController {
  constructor(
    private transactionUseCase: TransactionUseCaseInterface,
    private brokerUseCase: BrokerUseCaseInterface
  ) {}

  public insertCtrl = async (req: Request, res: Response) => {
    const body = req.body;
    const transaction = await this.transactionUseCase.createTransaction(body);
    if (transaction) await this.brokerUseCase.sendMessageBroker(transaction);

    res.status(201).send(transaction);
  };

  public findCtrl = async (req: Request, res: Response) => {
    const { transactionId } = req.params;
    const transaction = await this.transactionUseCase.findTransaction(
      transactionId
    );
    res.status(200).send(transaction);
  };

  public findUserTransactionsCtrl = async (req: Request, res: Response) => {
    const { transactionId } = req.params;
    const transaction = await this.transactionUseCase.getUserTransactions(
      transactionId
    );
    res.status(200).send(transaction);
  };
}
