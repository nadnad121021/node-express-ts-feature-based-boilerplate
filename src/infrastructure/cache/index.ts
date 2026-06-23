import redis from './redis.client';

export async function cacheSet(key: string, value: any, ttlSeconds?: number) {
  const data = JSON.stringify(value);
  if (ttlSeconds ) {
    if(redis) {
      await redis.set(key, data, 'EX', ttlSeconds);
    }
  } else {
    if(redis) {
      await redis.set(key, data);
    }
  }
}

export async function cacheGet<T = any>(key: string): Promise<T | null> {
  if (!redis) return null;
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
}

export async function cacheDel(key: string) {
  if (!redis) return;
  await redis.del(key);
}
