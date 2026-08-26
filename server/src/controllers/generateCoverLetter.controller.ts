import type { RequestHandler } from 'express';
import { generateAiContent } from '../services/aiOrchestrator.js';
import { SYSTEM_PROMPTS, buildUserPrompt, COVER_LETTER_TASK } from '../services/coverLetterPrompt.js';
import type { GenerateCoverLetterRequest } from '../schemas/generateCoverLetterRequest.schema.js';

export const generateCoverLetterController: RequestHandler = async (req, res) => {
  const body = req.body as GenerateCoverLetterRequest;
  const systemPrompt = SYSTEM_PROMPTS[body.uiLanguage];
  const userPrompt = buildUserPrompt(body);

  try {
    const result = await generateAiContent({ systemPrompt, userPrompt, task: COVER_LETTER_TASK });
    res.json({ ...result, generatedAt: new Date().toISOString() });
  } catch (err) {
    console.error('AI cover letter generation failed after exhausting all candidates:', err);
    res.status(503).json({
      error: 'ai_unavailable',
      message: 'Сервис генерации временно недоступен. Попробуйте, пожалуйста, ещё раз через минуту.',
    });
  }
};
