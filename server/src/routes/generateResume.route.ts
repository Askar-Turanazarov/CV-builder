import { Router } from 'express';
import { createLimiter } from '../middleware/rateLimit.js';
import { validateBody } from '../middleware/validateBody.js';
import { generateResumeRequestSchema } from '../schemas/generateResumeRequest.schema.js';
import { generateResumeController } from '../controllers/generateResume.controller.js';


export const generateResumeRouter = Router();
generateResumeRouter.post('/', createLimiter(10), validateBody(generateResumeRequestSchema), generateResumeController);
