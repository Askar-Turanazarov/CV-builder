import { ApiError, GoogleGenAI, ThinkingLevel } from '@google/genai';
import type { AiGenerateParams, AiProvider } from './aiProvider.types.js';
import { AiProviderError, failureKindForStatus, parseTaskOutput } from './aiProvider.types.js';

let client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  client ??= new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
  return client;
}

export const geminiProvider: AiProvider = {
  id: 'gemini',
  isConfigured: () => Boolean(process.env.GOOGLE_API_KEY),
  async generate<T>({ systemPrompt, userPrompt, model, task, signal }: AiGenerateParams<T>): Promise<T> {
    const label = `gemini:${model}`;
    let text: string | undefined;
    try {
      const response = await getClient().models.generateContent({
        model,
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          responseJsonSchema: task.jsonSchema,
          // Copywriting from given facts doesn't need reasoning — low (MINIMAL is
          // rejected by gemini-3.7+/3.8 flash) keeps latency near a non-thinking model.
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          abortSignal: signal,
        },
      });
      text = response.text;
    } catch (err) {
      const status = err instanceof ApiError ? err.status : undefined;
      throw new AiProviderError(`${label} request failed`, failureKindForStatus(status), { cause: err });
    }
    return parseTaskOutput(label, text, task);
  },
};
