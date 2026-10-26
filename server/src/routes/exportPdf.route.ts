import { Router } from 'express';
import { createLimiter } from '../middleware/rateLimit.js';
import { validateBody } from '../middleware/validateBody.js';
import { exportPdfRequestSchema } from '../schemas/exportPdfRequest.schema.js';
import { createPdfExportController, warmUpPdfController } from '../controllers/exportPdf.controller.js';

export const exportPdfRouter = Router();
exportPdfRouter.get('/warm', createLimiter(30), warmUpPdfController);
exportPdfRouter.post(
  '/',
  // Headless Chrome is pricier per request than the AI proxy, hence its own
  // limit — roomy enough for the client's background prerenders (one per edit pause).
  createLimiter(40),
  validateBody(exportPdfRequestSchema),
  createPdfExportController({
    printPath: '/print/resume',
    filename: 'resume.pdf',
    margin: { top: '12mm', bottom: '12mm', left: '12mm', right: '12mm' },
  }),
);
