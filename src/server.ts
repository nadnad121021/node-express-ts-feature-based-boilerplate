import app from './app';
import { AppDataSource, createDatabaseIfNotExists } from './db/data-source';
import config from '@config';
import logger from '@core/logger';

const PORT = Number(config.port) || 4000;

async function bootstrap() {
  try {
    // Local development only
    if (config.nodeEnv === 'development') {
      await createDatabaseIfNotExists();
    }

    await AppDataSource.initialize();

    logger.info('Database connection established successfully.');

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (err) {
    logger.error('Error during Data Source initialization:');
    logger.error(err);
    process.exit(1);
  }
}

bootstrap();

// Handle uncaught exceptions & unhandled rejections
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection:', reason);
  process.exit(1);
});
