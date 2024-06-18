import 'dotenv/config'
import { app } from './src/app';
import {
  connectConsumer,
  connectProducer,
  disconnectConsumer,
  disconnectProducer,
  initializeDb
} from './src/feature';

const start = async () => {


  // Ciclo para intentar conectar con el productor y el consumidor de Kafka
  let wrongConnectionProducer = true;
  while (wrongConnectionProducer) {
    try {
      await connectProducer();
      console.log('producer connected');
      await connectConsumer();
      console.log('consumer connected');

      wrongConnectionProducer = false;
    } catch (err) {
      console.log('kafka ... error conecting with producer');
      await sleep(3000);
    }
  }

  // Ciclo para intentar inicializar la base de datos
  let wrongConnectionDb = true;
  while (wrongConnectionDb) {
    try {
      await initializeDb();
      wrongConnectionDb = false;
    } catch (err) {
      console.log('DB ... error conecting with DB');
      await sleep(3000);
    }
  }


  // Manejo de la señal SIGINT (por ejemplo, Ctrl+C) para desconectar correctamente el productor y el consumidor de Kafka antes de salir
  process.on('SIGINT', async () => {
    await disconnectProducer();
    await disconnectConsumer();
    process.exit();
  });

  function sleep(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  const port = 8070;
  app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
  });
};

start();
