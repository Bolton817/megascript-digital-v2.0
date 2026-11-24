/**
 * In-memory sliding-window rate limiter & idempotency store
 * TDD Sheet 068: Rate limiting per IP and per session, idempotency key deduplication.
 */

interface RateLimitRecord {
  timestamps: number[];
}

interface IdempotencyRecord {
  data: any;
  expiresAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();
const idempotencyStore = new Map<string, IdempotencyRecord>();

/**
 * Checks and records a request against a sliding-window rate limit.
 *
 * @param key Unique identifier (e.g., `ip:127.0.0.1` or `email:user@example.com`)
 * @param limit Maximum allowed requests within window
 * @param windowMs Time window in milliseconds (default: 10 minutes)
 */
export function checkRateLimit(
  key: string,
  limit: number = 5,
  windowMs: number = 10 * 60 * 1000
): { success: boolean; remaining: number; resetMs: number } {
  const now = Date.now();
  const windowStart = now - windowMs;

  let record = rateLimitStore.get(key);
  if (!record) {
    record = { timestamps: [] };
    rateLimitStore.set(key, record);
  }

  // Filter timestamps within the current sliding window
  record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

  if (record.timestamps.length >= limit) {
    const oldest = record.timestamps[0] || now;
    const resetMs = Math.max(0, oldest + windowMs - now);
    return {
      success: false,
      remaining: 0,
      resetMs,
    };
  }

  record.timestamps.push(now);
  return {
    success: true,
    remaining: limit - record.timestamps.length,
    resetMs: windowMs,
  };
}

/**
 * Retrieves a cached idempotency result if still valid.
 */
export function getIdempotentResult<T = any>(key: string): T | null {
  const record = idempotencyStore.get(key);
  if (!record) return null;

  if (Date.now() > record.expiresAt) {
    idempotencyStore.delete(key);
    return null;
  }

  return record.data as T;
}

/**
 * Stores an idempotency result with a specified TTL (default 5 minutes).
 */
export function setIdempotentResult(
  key: string,
  data: any,
  ttlMs: number = 5 * 60 * 1000
): void {
  idempotencyStore.set(key, {
    data,
    expiresAt: Date.now() + ttlMs,
  });
}

/**
 * Clears old items periodically to prevent memory growth.
 */
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    idempotencyStore.forEach((record, key) => {
      if (now > record.expiresAt) {
        idempotencyStore.delete(key);
      }
    });
  }, 10 * 60 * 1000);
}
