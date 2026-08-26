import type { ZodType } from 'zod';

/**
 * Describes one AI generation task (resume content, cover letter, ...) in
 * both structured-output dialects the two providers need: Anthropic's
 * tool-use JSON Schema, and Gemini's `Type`-enum response schema. Providers
 * are otherwise fully generic over `T` — adding a new task never touches
 * anthropicProvider.ts/geminiProvider.ts/aiOrchestrator.ts.
 */
export interface AiTaskSpec<T> {
  toolName: string;
  toolDescription: string;
  anthropicInputSchema: Record<string, unknown>;
  geminiResponseSchema: Record<string, unknown>;
  resultSchema: ZodType<T>;
}

export interface AiGenerateParams<T> {
  systemPrompt: string;
  userPrompt: string;
  model: string;
  task: AiTaskSpec<T>;
}

export interface AiProvider {
  id: string;
  generate<T>(params: AiGenerateParams<T>): Promise<T>;
}

/**
 * Thrown by a provider when the failure is transient (rate limit, overload,
 * timeout) and the orchestrator should silently fall through to the next
 * candidate instead of surfacing an error to the user.
 */
export class RetryableAiError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'RetryableAiError';
  }
}
