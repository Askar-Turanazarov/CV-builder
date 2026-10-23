import Anthropic from '@anthropic-ai/sdk';
import type { AiGenerateParams, AiProvider } from './aiProvider.types.js';
import { AiProviderError, failureKindForStatus, parseTaskOutput } from './aiProvider.types.js';

let client: Anthropic | null = null;

// Created lazily so a missing key never matters until Claude is actually
// in the priority list. maxRetries: 0 — retrying is the orchestrator's job
// (it moves on to the next candidate instead of waiting on backoff).
function getClient(): Anthropic {
  client ??= new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, maxRetries: 0 });
  return client;
}

// Structured outputs (output_config.format) rather than forced tool use:
// current models (Sonnet 5.5, Opus 5.5) reject tool_choice "tool"/"any".
export const anthropicProvider: AiProvider = {
  id: 'anthropic',
  isConfigured: () => Boolean(process.env.ANTHROPIC_API_KEY),
  async generate<T>({ systemPrompt, userPrompt, model, task, signal }: AiGenerateParams<T>): Promise<T> {
    const label = `anthropic:${model}`;
    let response: Anthropic.Message;
    try {
      response = await getClient().messages.create(
        {
          model,
          max_tokens: 4000,
          system: systemPrompt,
          // Short copywriting task: low effort keeps latency close to a
          // non-reasoning model without disabling thinking (a 400 on some models).
          output_config: { effort: 'low', format: { type: 'json_schema', schema: task.jsonSchema } },
          messages: [{ role: 'user', content: userPrompt }],
        },
        { signal },
      );
    } catch (err) {
      const status = err instanceof Anthropic.APIError ? err.status : undefined;
      throw new AiProviderError(`${label} request failed`, failureKindForStatus(status), { cause: err });
    }

    if (response.stop_reason === 'refusal' || response.stop_reason === 'max_tokens') {
      throw new AiProviderError(`${label} stopped with ${response.stop_reason}`, 'invalid_output');
    }
    const text = response.content.find((block): block is Anthropic.TextBlock => block.type === 'text')?.text;
    return parseTaskOutput(label, text, task);
  },
};
