import { GoogleGenAI, Type } from '@google/genai';
import { ResumeGenerationSchema } from '../resumePrompt.js';
import type { AiGenerateParams, AiProvider } from './aiProvider.types.js';
import { RetryableAiError } from './aiProvider.types.js';

const client = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING },
    strengths: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },
  required: ['summary', 'strengths'],
};

export const geminiProvider: AiProvider = {
  id: 'gemini',
  async generate({ systemPrompt, userPrompt, model }: AiGenerateParams) {
    let response;
    try {
      response = await client.models.generateContent({
        model,
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          responseSchema: RESPONSE_SCHEMA,
        },
      });
    } catch (err) {
      const status = (err as { status?: number; error?: { code?: number } })?.status
        ?? (err as { error?: { code?: number } })?.error?.code;
      if (status === 429 || status === 503 || status === 500) {
        throw new RetryableAiError(`gemini:${model} unavailable`, err);
      }
      throw err;
    }

    const text = response.text;
    if (!text) {
      throw new RetryableAiError(`gemini:${model} returned empty response`);
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new RetryableAiError(`gemini:${model} returned invalid JSON`);
    }

    return ResumeGenerationSchema.parse(parsed);
  },
};
