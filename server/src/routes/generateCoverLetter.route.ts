import { Router } from 'express';
import { createLimiter } from '../middleware/rateLimit.js';
import { validateBody } from '../middleware/validateBody.js';
import { generateCoverLetterRequestSchema } from '../schemas/generateCoverLetterRequest.schema.js';
import { createAiGenerationController } from '../controllers/generateAi.controller.js';
import { COVER_LETTER_TASK, SYSTEM_PROMPTS, buildUserPrompt } from '../services/coverLetterPrompt.js';

export const generateCoverLetterRouter = Router();
generateCoverLetterRouter.post(
  '/',
  createLimiter(10),
  validateBody(generateCoverLetterRequestSchema),
  createAiGenerationController({ task: COVER_LETTER_TASK, systemPrompts: SYSTEM_PROMPTS, buildUserPrompt }),
);
