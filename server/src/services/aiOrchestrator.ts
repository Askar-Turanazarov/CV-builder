import type { AiFailureKind, AiProvider, AiTaskSpec } from './providers/aiProvider.types.js';
import { AiProviderError } from './providers/aiProvider.types.js';
import { anthropicProvider } from './providers/anthropicProvider.js';
import { geminiProvider } from './providers/geminiProvider.js';

interface Candidate {
  provider: AiProvider;
  model: string;
  key: string;
}

const PROVIDERS: Record<string, AiProvider> = {
  anthropic: anthropicProvider,
  gemini: geminiProvider,
};

// Fast flash models first; Claude is skipped while ANTHROPIC_API_KEY is empty.
// gemini-3.7/3.8-flash are left out on purpose: measured at 80s+ per resume,
// far over the per-attempt timeout.
export const DEFAULT_PRIORITY = [
  'gemini:gemini-3.6-flash',
  'gemini:gemini-3.5-flash-lite',
  'gemini:gemini-3.5-flash',
  'anthropic:claude-haiku-5-5',
  'anthropic:claude-sonnet-5-5',
].join(',');

// One attempt may not eat the whole request: a hung model must leave time
// for the next candidate. The total stays under the serverless maxDuration.
const ATTEMPT_TIMEOUT_MS = Number(process.env.AI_ATTEMPT_TIMEOUT_MS ?? 20_000);
const REQUEST_DEADLINE_MS = Number(process.env.AI_REQUEST_DEADLINE_MS ?? 50_000);
const MIN_ATTEMPT_MS = 3_000;

// Cooldown cache: a candidate that just failed is skipped on the following
// requests instead of being retried and timing out every time — this is what
// makes the fallback instant rather than "slow, then eventually falls back".
const COOLDOWN_MS: Record<AiFailureKind, number> = {
  transient: 60_000,
  config: 10 * 60_000,
  invalid_output: 15_000,
};
const cooldowns = new Map<string, { until: number; kind: AiFailureKind }>();

function parsePriority(raw: string | undefined): Candidate[] {
  return (raw?.trim() || DEFAULT_PRIORITY)
    .split(',')
    .map((entry) => {
      const [providerId, model] = entry.trim().split(':');
      return { provider: PROVIDERS[providerId], model, key: `${providerId}:${model}` };
    })
    .filter((c): c is Candidate => Boolean(c.provider && c.model && c.provider.isConfigured()));
}

function cooldownOf(c: Candidate): AiFailureKind | null {
  const entry = cooldowns.get(c.key);
  return entry && entry.until > Date.now() ? entry.kind : null;
}

export async function generateAiContent<T>(params: {
  systemPrompt: string;
  userPrompt: string;
  task: AiTaskSpec<T>;
}): Promise<T> {
  // Re-read on every call so .env edits apply without a module reload.
  const candidates = parsePriority(process.env.AI_PROVIDER_PRIORITY);
  if (candidates.length === 0) {
    throw new Error('no_ai_candidates_configured');
  }

  const warm = candidates.filter((c) => cooldownOf(c) === null);
  // If every candidate is cooling down (a brief blip across providers), retry
  // the ones that failed transiently rather than failing outright — but not
  // those with config errors (bad model id/key), which won't fix themselves.
  const retryable = candidates.filter((c) => cooldownOf(c) !== 'config');
  const pool = warm.length > 0 ? warm : retryable.length > 0 ? retryable : candidates;
  const deadline = Date.now() + REQUEST_DEADLINE_MS;

  const attempted: string[] = [];
  let lastError: unknown;
  for (const candidate of pool) {
    const remaining = deadline - Date.now();
    if (remaining < MIN_ATTEMPT_MS) break;

    attempted.push(candidate.key);
    const startedAt = Date.now();
    try {
      const result = await candidate.provider.generate({
        ...params,
        model: candidate.model,
        signal: AbortSignal.timeout(Math.min(ATTEMPT_TIMEOUT_MS, remaining)),
      });
      console.info(`[ai] ${params.task.name} via ${candidate.key} ok in ${Date.now() - startedAt}ms`);
      return result;
    } catch (err) {
      lastError = err;
      const kind: AiFailureKind = err instanceof AiProviderError ? err.kind : 'transient';
      cooldowns.set(candidate.key, { until: Date.now() + COOLDOWN_MS[kind], kind });
      const cause = err instanceof Error && err.cause instanceof Error ? ` — ${err.cause.message}` : '';
      const reason = (err instanceof Error ? err.message : String(err)) + cause;
      console.warn(`[ai] ${candidate.key} failed (${kind}) after ${Date.now() - startedAt}ms: ${reason}`);
    }
  }

  throw new Error(`all_ai_candidates_exhausted (tried: ${attempted.join(', ')})`, { cause: lastError });
}
