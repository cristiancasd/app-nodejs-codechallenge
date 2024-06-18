export const configureDependenciesMock = jest.fn().mockReturnValue({
  transactionRepository : {
    createTransaction: jest.fn(),
    editTransaction: jest.fn(),
    findTransaction: jest.fn(),
    getUserTransactions: jest.fn(),
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
