
import { app } from '../app';
import {
  connectConsumer,
  connectProducer,
  disconnectConsumer,
  disconnectProducer,
  initializeDb,
  
} from '../feature';

jest.mock('./src/app');
jest.mock('./src/feature', () => ({
  connectConsumer: jest.fn(),
  connectProducer: jest.fn(),
  disconnectConsumer: jest.fn(),
  disconnectProducer: jest.fn(),
  initializeDb: jest.fn()
}));

describe('start', () => {
  let originalProcessOn: NodeJS.Process['on'];

  beforeEach(() => {
    originalProcessOn = process.on;
    process.on = jest.fn((event, callback) => {
      if (event === 'SIGINT') {
        callback();
      }
    }) as unknown as NodeJS.Process['on'];
  });

  afterEach(() => {
    jest.clearAllMocks();
    process.on = originalProcessOn;
  });

  it('should start the server and connect to Kafka and DB successfully', async () => {
    (connectProducer as jest.Mock).mockResolvedValueOnce(undefined);
    (connectConsumer as jest.Mock).mockResolvedValueOnce(undefined);
    (initializeDb as jest.Mock).mockResolvedValueOnce(undefined);

    const listenMock = jest.spyOn(app, 'listen').mockImplementation((port, callback) => {
      callback();
      return { close: jest.fn() };
    });

    await import('./start');

    expect(connectProducer).toHaveBeenCalled();
    expect(connectConsumer).toHaveBeenCalled();
    expect(initializeDb).toHaveBeenCalled();
    expect(listenMock).toHaveBeenCalledWith(8070, expect.any(Function));
  });

  it('should retry connecting to Kafka if initial connection fails', async () => {
    (connectProducer as jest.Mock)
      .mockRejectedValueOnce(new Error('Kafka connection error'))
      .mockResolvedValueOnce(undefined);
    (connectConsumer as jest.Mock).mockResolvedValueOnce(undefined);
    (initializeDb as jest.Mock).mockResolvedValueOnce(undefined);

    const sleepMock = jest.spyOn(global, 'setTimeout').mockImplementation((cb) => cb());

    await import('./start');

    expect(connectProducer).toHaveBeenCalledTimes(2);
    expect(connectConsumer).toHaveBeenCalled();
    expect(initializeDb).toHaveBeenCalled();
    expect(sleepMock).toHaveBeenCalled();
  });

  it('should retry connecting to DB if initial connection fails', async () => {
    (connectProducer as jest.Mock).mockResolvedValueOnce(undefined);
    (connectConsumer as jest.Mock).mockResolvedValueOnce(undefined);
    (initializeDb as jest.Mock)
      .mockRejectedValueOnce(new Error('DB connection error'))
      .mockResolvedValueOnce(undefined);

    const sleepMock = jest.spyOn(global, 'setTimeout').mockImplementation((cb) => cb());

    await import('./start');

    expect(connectProducer).toHaveBeenCalled();
    expect(connectConsumer).toHaveBeenCalled();
    expect(initializeDb).toHaveBeenCalledTimes(2);
    expect(sleepMock).toHaveBeenCalled();
  });

  it('should handle SIGINT signal and disconnect Kafka', async () => {
    (connectProducer as jest.Mock).mockResolvedValueOnce(undefined);
    (connectConsumer as jest.Mock).mockResolvedValueOnce(undefined);
    (initializeDb as jest.Mock).mockResolvedValueOnce(undefined);

    await import('./start');

    process.emit('SIGINT');

    expect(disconnectProducer).toHaveBeenCalled();
    expect(disconnectConsumer).toHaveBeenCalled();
  });
});
