import { Router } from 'express';
import { createLimiter } from '../middleware/rateLimit.js';
import { validateBody } from '../middleware/validateBody.js';
import { exportCoverLetterRequestSchema } from '../schemas/exportCoverLetterRequest.schema.js';
import { createPdfExportController } from '../controllers/exportPdf.controller.js';

export const exportCoverLetterPdfRouter = Router();
exportCoverLetterPdfRouter.post(
  '/',
  createLimiter(40),
  validateBody(exportCoverLetterRequestSchema),
  createPdfExportController({
    printPath: '/print/letter',
    filename: 'cover-letter.pdf',
    margin: { top: '18mm', bottom: '18mm', left: '18mm', right: '18mm' },
  }),
);
