import {
  TransactionStatesConstant,
  TransactionTopicsConstant,
  TransactionTypesNamesConstant,
} from '../../../../core';
import { BrokerRepositoryImpl, producer } from '../../../../feature';
import {
  BrokerEntity,
  BrokerRepositoryInterface
} from '../../../../feature/domain';

// Mock de producer.send
jest.mock('../../../../feature/infrastructure/broker/kafka.producer', () => ({
  producer: {
    send: jest.fn()
  }
}));

describe('BrokerRepositoryImpl', () => {
  const transactionEntity = {
    transactionStatus: { name: TransactionStatesConstant.pending },
    createdAt: new Date(),
    transactionExternalId: '',
    transactionType: { name: TransactionTypesNamesConstant.PagosProgramados },
    value: 1
  };

  let brokerRepository: BrokerRepositoryInterface;

  beforeEach(() => {
    brokerRepository = new BrokerRepositoryImpl();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send message to Kafka and return data', async () => {
    // Arrange
    const mockData: BrokerEntity = {
      topic: TransactionTopicsConstant.TransactionCreated,
      message: transactionEntity
    };
    const expectedData = { ...mockData };

    // Mock para producer.send
    (producer.send as jest.Mock).mockResolvedValueOnce({});

    // Act
    const result = await brokerRepository.sendMessageBroker(mockData);

    // Assert
    expect(producer.send).toHaveBeenCalledWith({
      topic: mockData.topic,
      messages: [{ value: JSON.stringify(mockData.message) }]
    });
    expect(result).toEqual(expectedData);
  });
});
