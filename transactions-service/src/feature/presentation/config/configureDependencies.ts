
import { BrokerUseCaseImpl } from '../../application/broker.useCase';
import { TransactionUseCaseImpl } from '../../application/transaction.useCase';
import { BrokerRepositoryImpl } from '../../infrastructure/repository/broker.repository';
import { TransactionRepositoryImpl } from '../../infrastructure/repository/transaction.repository';
import { TransactionController } from '../controllers/transaction.ctrl';

// In this method you choose the dependencies to use
const configureDependencies = () => {
  const transactionRepository = new TransactionRepositoryImpl();
  const transactionUseCase = new TransactionUseCaseImpl(transactionRepository);

  const brokerRepository = new BrokerRepositoryImpl();
  const brokerUseCase = new BrokerUseCaseImpl(brokerRepository);

  const transactionCtrl = new TransactionController(
    transactionUseCase,
    brokerUseCase
  );

  return {
    transactionRepository,
    transactionCtrl
  };
};

export default configureDependencies;
