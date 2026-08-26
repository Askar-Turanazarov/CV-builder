import type { RequestHandler } from 'express';
import { generateAiContent } from '../services/aiOrchestrator.js';
import { SYSTEM_PROMPTS, buildUserPrompt, RESUME_TASK } from '../services/resumePrompt.js';
import type { GenerateResumeRequest } from '../schemas/generateResumeRequest.schema.js';

export const generateResumeController: RequestHandler = async (req, res) => {
  const body = req.body as GenerateResumeRequest;
  const systemPrompt = SYSTEM_PROMPTS[body.uiLanguage];
  const userPrompt = buildUserPrompt(body);

  try {
    const result = await generateAiContent({ systemPrompt, userPrompt, task: RESUME_TASK });
    res.json({ ...result, generatedAt: new Date().toISOString() });
  } catch (err) {
    console.error('AI generation failed after exhausting all candidates:', err);
    res.status(503).json({
      error: 'ai_unavailable',
      message: 'Сервис генерации временно недоступен. Попробуйте, пожалуйста, ещё раз через минуту.',
    });
  }
};
