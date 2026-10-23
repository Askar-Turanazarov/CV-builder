import { Redis } from '@upstash/redis';

/**
 * Short-lived key/value store for the site → bot handoff. The link is created
 * by one serverless instance and the bot's webhook may land on another, so in
 * production this is Upstash Redis (connected via the Vercel Marketplace,
 * which sets KV_REST_API_* — or UPSTASH_REDIS_REST_* when added by hand).
 * Locally, without those env vars, a per-process Map is enough.
 */
interface HandoffStore {
  set(key: string, value: unknown, ttlSeconds: number): Promise<void>;
  get<T>(key: string): Promise<T | null>;
  /** Reads and deletes atomically, so a link can be redeemed only once. */
  take<T>(key: string): Promise<T | null>;
}

function createRedisStore(url: string, token: string): HandoffStore {
  const redis = new Redis({ url, token });
  return {
    set: async (key, value, ttlSeconds) => {
      await redis.set(key, value, { ex: ttlSeconds });
    },
    get: (key) => redis.get(key),
    take: (key) => redis.getdel(key),
  };
}

function createMemoryStore(): HandoffStore {
  const entries = new Map<string, { value: unknown; expiresAt: number }>();
  const read = (key: string) => {
    const entry = entries.get(key);
    if (!entry) return null;
    if (entry.expiresAt < Date.now()) {
      entries.delete(key);
      return null;
    }
    return entry.value;
  };
  return {
    set: async (key, value, ttlSeconds) => {
      entries.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
    },
    get: async <T>(key: string) => read(key) as T | null,
    take: async <T>(key: string) => {
      const value = read(key);
      entries.delete(key);
      return value as T | null;
    },
  };
}

let store: HandoffStore | null = null;

export function isPersistentStoreConfigured(): boolean {
  return Boolean(
    (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) ||
      (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN),
  );
}

export function handoffStore(): HandoffStore {
  if (!store) {
    const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
    store = url && token ? createRedisStore(url, token) : createMemoryStore();
  }
  return store;
}
