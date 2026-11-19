import { timingSafeEqual } from 'node:crypto';
import { Router, type RequestHandler } from 'express';
import { createLimiter } from '../middleware/rateLimit.js';
import { handoffStore, isPersistentStoreConfigured } from '../services/telegram/handoffStore.js';

/**
 * Vercel Cron sends `Authorization: Bearer $CRON_SECRET` when that env var is
 * set. Without it the endpoint stays open: it only sends PING, and the rate
 * limit keeps it from being used to burn the free Redis quota.
 */
function isAuthorized(header: string | undefined): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;
  const expected = Buffer.from(`Bearer ${secret}`);
  const given = Buffer.from(header ?? '');
  return expected.length === given.length && timingSafeEqual(expected, given);
}

/**
 * A caller without the secret falls through to Express's own 404, so the
 * route looks like it doesn't exist. Runs before the rate limiter, which
 * would otherwise add its headers and give the route away.
 */
const hideUnlessAuthorized: RequestHandler = (req, _res, next) => {
  next(isAuthorized(req.get('Authorization')) ? undefined : 'router');
};

/**
 * Upstash archives a free database after 30 days without commands. When
 * nobody sends a resume to Telegram for that long, this scheduled PING keeps
 * the database active.
 */
const keepAliveController: RequestHandler = async (_req, res) => {
  if (!isPersistentStoreConfigured()) {
    res.json({ ok: true, redis: 'not_configured' });
    return;
  }
  try {
    const reply = await handoffStore().ping();
    res.json({ ok: true, redis: reply });
  } catch (err) {
    console.error('[cron] redis keep-alive failed:', err);
    res.status(503).json({ ok: false, error: 'redis_unavailable' });
  }
};

export const cronRouter = Router();
cronRouter.get('/keep-alive', hideUnlessAuthorized, createLimiter(5), keepAliveController);
