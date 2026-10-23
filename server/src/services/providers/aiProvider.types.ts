import type { ZodType } from 'zod';

/**
 * Describes one AI generation task (resume content, cover letter, ...).
 * `jsonSchema` is plain JSON Schema understood by both providers' structured
 * output modes (Anthropic `output_config.format`, Gemini `responseJsonSchema`).
 * Keep it to the common subset: no min/max/length constraints — enforce those
 * in `resultSchema`, which validates every response. Adding a new task never
 * touches the providers or the orchestrator.
 */
export interface AiTaskSpec<T> {
  name: string;
  jsonSchema: Record<string, unknown>;
  resultSchema: ZodType<T>;
}

export interface AiGenerateParams<T> {
  systemPrompt: string;
  userPrompt: string;
  model: string;
  task: AiTaskSpec<T>;
  signal: AbortSignal;
}

export interface AiProvider {
  id: string;
  isConfigured(): boolean;
  generate<T>(params: AiGenerateParams<T>): Promise<T>;
}

/**
 * Why a candidate failed — drives how long the orchestrator skips it:
 * - transient: rate limit, overload, timeout, network — try again soon;
 * - config: bad model id, key or request shape — won't fix itself quickly;
 * - invalid_output: model answered, but not with schema-valid JSON.
 */
export type AiFailureKind = 'transient' | 'config' | 'invalid_output';

export class AiProviderError extends Error {
  constructor(
    message: string,
    public readonly kind: AiFailureKind,
    options?: { cause?: unknown },
  ) {
    super(message, options);
    this.name = 'AiProviderError';
  }
}

export function failureKindForStatus(status: number | undefined): AiFailureKind {
  if (status === undefined) return 'transient'; // network error / abort
  if (status === 408 || status === 409 || status === 429 || status >= 500) return 'transient';
  return 'config';
}

/** Parses provider text as JSON and validates it against the task schema. */
export function parseTaskOutput<T>(label: string, text: string | undefined, task: AiTaskSpec<T>): T {
  if (!text) {
    throw new AiProviderError(`${label} returned empty response`, 'invalid_output');
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (err) {
    throw new AiProviderError(`${label} returned invalid JSON`, 'invalid_output', { cause: err });
  }
  const result = task.resultSchema.safeParse(parsed);
  if (!result.success) {
    throw new AiProviderError(`${label} output failed validation`, 'invalid_output', { cause: result.error });
  }
  return result.data;
}
