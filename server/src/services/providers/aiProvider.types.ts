import type { ResumeGenerationResult } from '../resumePrompt.js';

export interface AiGenerateParams {
  systemPrompt: string;
  userPrompt: string;
  model: string;
}

export interface AiProvider {
  id: string;
  generate(params: AiGenerateParams): Promise<ResumeGenerationResult>;
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
