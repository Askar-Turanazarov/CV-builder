import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { validateBody } from '../middleware/validateBody.js';
import { exportCoverLetterRequestSchema } from '../schemas/exportCoverLetterRequest.schema.js';
import { exportCoverLetterPdfController, getCoverLetterPdfDataController } from '../controllers/exportCoverLetterPdf.controller.js';

const isProduction = process.env.NODE_ENV === 'production';

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: isProduction ? 15 : 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'rate_limited', message: 'Слишком много запросов. Попробуйте позже.' },
});

export const exportCoverLetterPdfRouter = Router();
exportCoverLetterPdfRouter.post('/', limiter, validateBody(exportCoverLetterRequestSchema), exportCoverLetterPdfController);
exportCoverLetterPdfRouter.get('/data/:token', getCoverLetterPdfDataController);
