import { Router } from 'express';
import { createLimiter } from '../middleware/rateLimit.js';
import { validateBody } from '../middleware/validateBody.js';
import { generateResumeRequestSchema } from '../schemas/generateResumeRequest.schema.js';
import { createAiGenerationController } from '../controllers/generateAi.controller.js';
import { RESUME_TASK, SYSTEM_PROMPTS, buildUserPrompt } from '../services/resumePrompt.js';

export const generateResumeRouter = Router();
generateResumeRouter.post(
  '/',
  createLimiter(10),
  validateBody(generateResumeRequestSchema),
  createAiGenerationController({ task: RESUME_TASK, systemPrompts: SYSTEM_PROMPTS, buildUserPrompt }),
);
