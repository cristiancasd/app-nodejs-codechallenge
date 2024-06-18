export const configureDependenciesMock = jest.fn().mockReturnValue({
  transactionRepository: {
    editTransaction: jest.fn()
  }
});

export const kafkaMock = {
  consumer: jest.fn().mockReturnValue({
    connect: jest.fn(),
    disconnect: jest.fn(),
    subscribe: jest.fn(),
    run: jest.fn()
  })
};
