import { kafkaProducer, connectProducer, disconnectProducer } from '../../../infrastructure/kafka/kafkaProducer';

// Mock para kafkaProducer.connect y kafkaProducer.disconnect
jest.mock('kafkajs', () => ({
  __esModule: true,
  Kafka: jest.fn().mockImplementation(() => ({
    producer: jest.fn().mockReturnValue({
      connect: jest.fn(),
      disconnect: jest.fn()
    })
  }))
}));

describe('Kafka Producer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('connectProducer', () => {
    it('should connect to Kafka successfully', async () => {
      await connectProducer();

      expect(kafkaProducer.connect).toHaveBeenCalled();
    });

    it('should handle connection errors', async () => {
      // Simular error al conectar
      (kafkaProducer.connect as jest.Mock).mockRejectedValueOnce(new Error('Connection failed'));

      await expect(connectProducer()).rejects.toThrow('Connection failed');
    });
  });

  describe('disconnectProducer', () => {
    it('should disconnect from Kafka successfully', async () => {
      await disconnectProducer();

      expect(kafkaProducer.disconnect).toHaveBeenCalled();
    });

    it('should handle disconnection errors', async () => {
      // Simular error al desconectar
      (kafkaProducer.disconnect as jest.Mock).mockRejectedValueOnce(new Error('Disconnection failed'));

      await expect(disconnectProducer()).rejects.toThrow('Disconnection failed');
    });
  });
});
