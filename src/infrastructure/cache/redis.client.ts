import Redis from 'ioredis';
import logger from '../../core/logger';
import config from '@config';

const redis = config.enableCache ? new Redis({
  host: config.redis?.host,
  port: config.redis?.port,
  password: config.redis?.password,
}) : null;

if (redis) {
  redis.on('connect', () => {
    logger.info('Redis connected');
  });
}

if (redis) {
  redis.on('error', (err) => {
    logger.error('Redis error:', err);
  });
}

export default redis;
