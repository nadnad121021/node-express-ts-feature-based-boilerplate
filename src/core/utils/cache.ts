import redis from '../../core/utils/redisClient';

export async function cacheSet(key: string, value: any, ttlSeconds?: number) {
  const data = JSON.stringify(value);
  if (ttlSeconds) {
    await redis.set(key, data, 'EX', ttlSeconds);
  } else {
    await redis.set(key, data);
  }
}

export async function cacheGet<T = any>(key: string): Promise<T | null> {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
}

export async function cacheDel(key: string) {
  await redis.del(key);
}
