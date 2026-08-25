import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { validateBody } from '../middleware/validateBody.js';
import { exportPdfRequestSchema } from '../schemas/exportPdfRequest.schema.js';
import { exportPdfController, getExportPdfDataController } from '../controllers/exportPdf.controller.js';

const isProduction = process.env.NODE_ENV === 'production';

// PDF rendering (headless Chrome) is meaningfully more expensive per-request
// than the AI proxy route, so the production ceiling is a bit stricter.
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: isProduction ? 15 : 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'rate_limited', message: 'Слишком много запросов. Попробуйте позже.' },
});

export const exportPdfRouter = Router();
exportPdfRouter.post('/', limiter, validateBody(exportPdfRequestSchema), exportPdfController);
exportPdfRouter.get('/data/:token', getExportPdfDataController);
