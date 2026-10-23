import rateLimit from 'express-rate-limit';

const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';

/**
 * Per-IP limit over a 10-minute window. The production ceiling is tight
 * because the AI keys are shared by every visitor with no auth in front;
 * outside production it's relaxed so clicking "Generate" repeatedly while
 * testing doesn't lock you out. On serverless the counter is per warm
 * instance, so it's a soft guard rather than a hard quota.
 */
export function createLimiter(productionLimit: number) {
  return rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: isProduction ? productionLimit : 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'rate_limited', message: 'Слишком много запросов. Попробуйте позже.' },
  });
}
