import { Router } from 'express';
import { createLimiter } from '../middleware/rateLimit.js';
import { validateBody } from '../middleware/validateBody.js';
import { generateCoverLetterRequestSchema } from '../schemas/generateCoverLetterRequest.schema.js';
import { generateCoverLetterController } from '../controllers/generateCoverLetter.controller.js';


export const generateCoverLetterRouter = Router();
generateCoverLetterRouter.post('/', createLimiter(10), validateBody(generateCoverLetterRequestSchema), generateCoverLetterController);
