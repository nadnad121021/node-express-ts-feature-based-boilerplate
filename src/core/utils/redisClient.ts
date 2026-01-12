import Redis from 'ioredis';
import logger from './logger';
import config from '@config';

const redis = new Redis({
  host: config.redis?.host,
  port: config.redis?.port,
  password: config.redis?.password,
});

redis.on('connect', () => {
  logger.info('Redis connected');
});

redis.on('error', (err) => {
  logger.error('Redis error:', err);
});

export default redis;
