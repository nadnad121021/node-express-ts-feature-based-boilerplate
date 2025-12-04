import app from './app';
import { AppDataSource } from './db/data-source';
import config from '@config';
import logger from '@core/utils/logger';

const PORT = Number(config.port) || 4000;

// Initialize the database
AppDataSource.initialize()
  .then(() => {
    logger.info('Database connection established successfully.');

    // Start Express server
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error('Error during Data Source initialization:');
    logger.error(err);
    process.exit(1); // Exit process if DB fails to connect
  });

// Handle uncaught exceptions & unhandled rejections
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection:', reason);
  process.exit(1);
});
