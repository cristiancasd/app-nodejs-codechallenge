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
  host:  process.env.DB_URL || defautlDbConfig.host,
  port: defautlDbConfig.port,
  username: defautlDbConfig.username,
  password: defautlDbConfig.password,
  database: 'postgres',
  synchronize: true,
  logging: defautlDbConfig.logging,
  entities: [path.join(__dirname, modelsFilesRoutes)]
});

const initializeDb = async () => {
  try {
    await connectDB.initialize();
    console.log(initializedDbMessage);
  } catch (err) {
    console.log('error conecting DB', err)
    throw err; 
  }
};

export { connectDB, initializeDb };
