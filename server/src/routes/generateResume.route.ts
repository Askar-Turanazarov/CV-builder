import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { validateBody } from '../middleware/validateBody.js';
import { generateResumeRequestSchema } from '../schemas/generateResumeRequest.schema.js';
import { generateResumeController } from '../controllers/generateResume.controller.js';

// 10/10min is a reasonable ceiling in production (the API key is shared
// across every visitor, with no auth layer in front of it). That's far too
// tight for local development, where clicking "Generate" repeatedly while
// testing is normal, so it's relaxed outside NODE_ENV=production.
const isProduction = process.env.NODE_ENV === 'production';

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: isProduction ? 10 : 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'rate_limited', message: 'Слишком много запросов. Попробуйте позже.' },
});

export const generateResumeRouter = Router();
generateResumeRouter.post('/', limiter, validateBody(generateResumeRequestSchema), generateResumeController);
