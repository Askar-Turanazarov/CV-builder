import { Router } from 'express';
import { z } from 'zod';
import { createLimiter } from '../middleware/rateLimit.js';
import { validateBody } from '../middleware/validateBody.js';
import { exportPdfRequestSchema } from '../schemas/exportPdfRequest.schema.js';
import {
  createTelegramLinkController,
  sendToTelegramController,
  telegramConfigController,
  telegramStatusController,
  telegramWebhookController,
} from '../controllers/telegram.controller.js';

const sendRequestSchema = z.object({
  chatToken: z.string().min(1).max(200),
  resume: exportPdfRequestSchema,
});

export const telegramRouter = Router();
telegramRouter.get('/config', createLimiter(60), telegramConfigController);
// Each link stores a resume and later costs a PDF render — same budget as PDF export.
telegramRouter.post('/link', createLimiter(15), validateBody(exportPdfRequestSchema), createTelegramLinkController);
telegramRouter.get('/status', createLimiter(600), telegramStatusController);
telegramRouter.post('/send', createLimiter(15), validateBody(sendRequestSchema), sendToTelegramController);
telegramRouter.post('/webhook', telegramWebhookController);
