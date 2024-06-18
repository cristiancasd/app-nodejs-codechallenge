import 'dotenv/config'
import {
  disconnectConsumer,
  runConsumer
} from './infrastructure/kafka/kafkaConsumer';
import {
  connectProducer,
  disconnectProducer
} from './infrastructure/kafka/kafkaProducer';

const startService = async () => {
  let wrongConnection = true;
  while (wrongConnection) {
    try {
      await connectProducer();
      console.log('producer conected');

      await runConsumer();
      console.log('consumer running');

      wrongConnection = false;
    } catch (err) {
      console.log('kafka ... error conecting with consumer');
      await sleep(3000);
      function sleep(ms: number) {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
      }
    }
  }

  process.on('SIGINT', async () => {
    await disconnectProducer();
    await disconnectConsumer();
    process.exit();
  });
};

startService();
