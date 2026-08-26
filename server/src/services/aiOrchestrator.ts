import type { AiProvider, AiTaskSpec } from './providers/aiProvider.types.js';
import { RetryableAiError } from './providers/aiProvider.types.js';
import { anthropicProvider } from './providers/anthropicProvider.js';
import { geminiProvider } from './providers/geminiProvider.js';

interface Candidate {
  provider: string;
  model: string;
}

const PROVIDERS: Record<string, AiProvider> = {
  anthropic: anthropicProvider,
  gemini: geminiProvider,
};

const DEFAULT_PRIORITY =
  'anthropic:claude-opus-5,anthropic:claude-sonnet-5,gemini:gemini-3.6-flash,gemini:gemini-3.5-flash';

function hasKeyFor(provider: string): boolean {
  if (provider === 'anthropic') return Boolean(process.env.ANTHROPIC_API_KEY);
  if (provider === 'gemini') return Boolean(process.env.GOOGLE_API_KEY);
  return true;
}

function parsePriority(raw: string | undefined): Candidate[] {
  return (raw ?? DEFAULT_PRIORITY)
    .split(',')
    .map((entry) => {
      const [provider, model] = entry.trim().split(':');
      return { provider, model };
    })
    .filter((c): c is Candidate => Boolean(c.provider && c.model && PROVIDERS[c.provider]))
    .filter((c) => hasKeyFor(c.provider));
}

// Cooldown cache: a candidate that just failed with a retryable error is
// skipped immediately on subsequent requests instead of being retried and
// timing out every time — this is what makes the fallback feel instant to
// the user rather than "slow, then eventually falls back".
const COOLDOWN_MS = 60_000;
const cooldownUntil = new Map<string, number>();

function candidateKey(c: Candidate): string {
  return `${c.provider}:${c.model}`;
}

function isCoolingDown(c: Candidate): boolean {
  const until = cooldownUntil.get(candidateKey(c));
  return typeof until === 'number' && until > Date.now();
}

function markCooldown(c: Candidate, ms: number): void {
  cooldownUntil.set(candidateKey(c), Date.now() + ms);
}

export async function generateAiContent<T>(params: {
  systemPrompt: string;
  userPrompt: string;
  task: AiTaskSpec<T>;
}): Promise<T> {
  // Re-read AI_PROVIDER_PRIORITY on every call rather than caching it once at
  // module load — guarantees the current .env content is always honored,
  // regardless of process/module-caching quirks across dev-server restarts.
  const candidates = parsePriority(process.env.AI_PROVIDER_PRIORITY);

  if (candidates.length === 0) {
    throw new Error('no_ai_candidates_configured');
  }

  const warm = candidates.filter((c) => !isCoolingDown(c));
  // If literally every candidate is cooling down (e.g. a brief blip across
  // providers), try the full list anyway rather than failing outright.
  const pool = warm.length > 0 ? warm : candidates;

  const attempted: string[] = [];
  let lastError: unknown;
  for (const candidate of pool) {
    const provider = PROVIDERS[candidate.provider];
    const key = candidateKey(candidate);
    attempted.push(key);
    console.info(`[ai] trying candidate ${key}`);
    try {
      const result = await provider.generate({
        systemPrompt: params.systemPrompt,
        userPrompt: params.userPrompt,
        model: candidate.model,
        task: params.task,
      });
      console.info(`[ai] candidate ${key} succeeded`);
      return result;
    } catch (err) {
      lastError = err;
      const cooldown = err instanceof RetryableAiError ? COOLDOWN_MS : 15_000;
      markCooldown(candidate, cooldown);
      console.warn(`[ai] candidate ${key} failed, falling through:`, err instanceof Error ? err.message : err);
    }
  }

  throw new Error(`all_ai_candidates_exhausted (tried: ${attempted.join(', ')})`, { cause: lastError });
}
