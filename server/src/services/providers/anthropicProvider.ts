import Anthropic from '@anthropic-ai/sdk';
import { ResumeGenerationSchema } from '../resumePrompt.js';
import type { AiGenerateParams, AiProvider } from './aiProvider.types.js';
import { RetryableAiError } from './aiProvider.types.js';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const RESUME_TOOL_NAME = 'submit_resume_content';

const RESUME_TOOL = {
  name: RESUME_TOOL_NAME,
  description: 'Отправить сформированное описание резюме и сильные стороны кандидата в структурированном виде.',
  input_schema: {
    type: 'object' as const,
    properties: {
      summary: {
        type: 'string' as const,
        description: 'Профессиональное описание кандидата, 3-5 предложений.',
      },
      strengths: {
        type: 'array' as const,
        items: { type: 'string' as const },
        minItems: 3,
        maxItems: 6,
        description: 'Сильные стороны кандидата, каждая опирается на конкретный факт из входных данных.',
      },
    },
    required: ['summary', 'strengths'],
  },
};

// Tool-use forcing (not free-text parsing) so the response is always a
// structured, schema-shaped JSON object regardless of model chatter.
export const anthropicProvider: AiProvider = {
  id: 'anthropic',
  async generate({ systemPrompt, userPrompt, model }: AiGenerateParams) {
    let response;
    try {
      response = await client.messages.create({
        model,
        max_tokens: 2000,
        system: systemPrompt,
        tools: [RESUME_TOOL],
        tool_choice: { type: 'tool', name: RESUME_TOOL_NAME },
        messages: [{ role: 'user', content: userPrompt }],
      });
    } catch (err) {
      const status = (err as { status?: number })?.status;
      if (status === 429 || status === 503 || status === 529 || status === 500) {
        throw new RetryableAiError(`anthropic:${model} unavailable`, err);
      }
      throw err;
    }

    const toolUse = response.content.find(
      (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use',
    );
    if (!toolUse) {
      throw new RetryableAiError(`anthropic:${model} returned no structured output`);
    }

    return ResumeGenerationSchema.parse(toolUse.input);
  },
};
