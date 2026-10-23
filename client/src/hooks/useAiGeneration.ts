import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { generateResume, ApiError, type GenerateResumeRequestBody } from '../lib/api';
import type { AiGeneratedContent } from '../types/resume';

export type AiGenerationStatus = 'idle' | 'loading' | 'success' | 'error';

export function useAiGeneration() {
  const { t } = useTranslation('common');
  const [status, setStatus] = useState<AiGenerationStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const generate = useCallback(
    async (body: GenerateResumeRequestBody): Promise<AiGeneratedContent | null> => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setStatus('loading');
      setError(null);

      try {
        const result = await generateResume(body, controller.signal);
        setStatus('success');
        return {
          summary: result.summary,
          strengths: result.strengths,
          generatedAt: result.generatedAt,
          sourceHash: hashInput(body),
        };
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return null;
        }
        setStatus('error');
        setError(err instanceof ApiError && err.code === 'rate_limited' ? t('errors.rateLimited') : t('errors.aiUnavailable'));
        return null;
      }
    },
    [t],
  );

  const cancel = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return { status, error, generate, cancel };
}

// Cheap fingerprint (not cryptographic) used only to flag when the AI
// content in the store may be stale relative to the current form inputs.
function hashInput(body: GenerateResumeRequestBody): string {
  const json = JSON.stringify(body);
  let hash = 0;
  for (let i = 0; i < json.length; i += 1) {
    hash = (hash * 31 + json.charCodeAt(i)) | 0;
  }
  return hash.toString(16);
}
