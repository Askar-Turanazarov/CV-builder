import Anthropic from '@anthropic-ai/sdk';
import type { AiGenerateParams, AiProvider } from './aiProvider.types.js';
import { RetryableAiError } from './aiProvider.types.js';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Tool-use forcing (not free-text parsing) so the response is always a
// structured, schema-shaped JSON object regardless of model chatter.
export const anthropicProvider: AiProvider = {
  id: 'anthropic',
  async generate<T>({ systemPrompt, userPrompt, model, task }: AiGenerateParams<T>): Promise<T> {
    const tool = {
      name: task.toolName,
      description: task.toolDescription,
      input_schema: {
        type: 'object' as const,
        ...task.anthropicInputSchema,
      },
    };

    let response;
    try {
      response = await client.messages.create({
        model,
        max_tokens: 2000,
        system: systemPrompt,
        tools: [tool],
        tool_choice: { type: 'tool', name: task.toolName },
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

    return task.resultSchema.parse(toolUse.input);
  },
};
