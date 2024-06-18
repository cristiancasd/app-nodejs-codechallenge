import path from 'path';
import { DataSource } from 'typeorm';
import {
  defautlDbConfig,
  initializedDbErrorMessage,
  initializedDbMessage,
  modelsFilesRoutes
} from './databaseConstants';

const connectDB = new DataSource({
  type: 'postgres',
  host: defautlDbConfig.host,
  port: defautlDbConfig.port,
  username: defautlDbConfig.username,
  password: defautlDbConfig.password,
  database: 'postgres',
  synchronize: true,
  logging: defautlDbConfig.logging,
  entities: [path.join(__dirname, modelsFilesRoutes)]
});

const initializeDb = async () => {
  connectDB
    .initialize()
    .then(() => {
      console.log(initializedDbMessage);
    })
    .catch((err) => {
      console.error(initializedDbErrorMessage, err);
    });
};

export { connectDB, initializeDb };
