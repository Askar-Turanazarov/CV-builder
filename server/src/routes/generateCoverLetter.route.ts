import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { validateBody } from '../middleware/validateBody.js';
import { generateCoverLetterRequestSchema } from '../schemas/generateCoverLetterRequest.schema.js';
import { generateCoverLetterController } from '../controllers/generateCoverLetter.controller.js';

const isProduction = process.env.NODE_ENV === 'production';

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: isProduction ? 10 : 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'rate_limited', message: 'Слишком много запросов. Попробуйте позже.' },
});

export const generateCoverLetterRouter = Router();
generateCoverLetterRouter.post('/', limiter, validateBody(generateCoverLetterRequestSchema), generateCoverLetterController);
