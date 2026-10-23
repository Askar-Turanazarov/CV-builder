import type { RequestHandler } from 'express';
import { generateAiContent } from '../services/aiOrchestrator.js';
import type { AiTaskSpec } from '../services/providers/aiProvider.types.js';

type UiLanguage = 'ru' | 'en' | 'uz';

/**
 * One handler shape for every AI generation endpoint: build the prompts from
 * the (already validated) body, run the provider fallback chain, and map a
 * total failure to a 503 with an error code the client localizes.
 */
export function createAiGenerationController<TBody extends { uiLanguage: UiLanguage }, TResult>(params: {
  task: AiTaskSpec<TResult>;
  systemPrompts: Record<UiLanguage, string>;
  buildUserPrompt: (body: TBody) => string;
}): RequestHandler {
  return async (req, res) => {
    const body = req.body as TBody;
    try {
      const result = await generateAiContent({
        systemPrompt: params.systemPrompts[body.uiLanguage],
        userPrompt: params.buildUserPrompt(body),
        task: params.task,
      });
      res.json({ ...result, generatedAt: new Date().toISOString() });
    } catch (err) {
      console.error(`AI ${params.task.name} generation failed after exhausting all candidates:`, err);
      res.status(503).json({
        error: 'ai_unavailable',
        message: 'Сервис генерации временно недоступен. Попробуйте, пожалуйста, ещё раз через минуту.',
      });
    }
  };
}
