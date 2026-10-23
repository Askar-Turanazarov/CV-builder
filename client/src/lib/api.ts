import type { ResumeData, UiLanguage } from '../types/resume';

export interface GenerateResumeRequestBody {
  uiLanguage: UiLanguage;
  jobTitle: string;
  experience: {
    position: string;
    company: string;
    startDate: string;
    endDate: string | null;
    description: string;
  }[];
  education: { institution: string; degree: string; fieldOfStudy?: string }[];
  skills: string[];
  languages: { name: string; level: string }[];
}

export interface GenerateResumeResponse {
  summary: string;
  strengths: string[];
  generatedAt: string;
}

/** Carries the server's machine-readable error code (e.g. 'rate_limited'), which the UI localizes. */
export class ApiError extends Error {
  constructor(
    public readonly code: string,
    public readonly status: number,
  ) {
    super(code);
    this.name = 'ApiError';
  }
}

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

async function post(path: string, body: unknown, signal?: AbortSignal): Promise<Response> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  });
  if (!res.ok) {
    const payload = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new ApiError(payload?.error ?? 'request_failed', res.status);
  }
  return res;
}

export async function generateResume(
  body: GenerateResumeRequestBody,
  signal?: AbortSignal,
): Promise<GenerateResumeResponse> {
  const res = await post('/api/generate-resume', body, signal);
  return res.json() as Promise<GenerateResumeResponse>;
}

export async function downloadResumePdf(data: ResumeData, signal?: AbortSignal): Promise<Blob> {
  const res = await post('/api/export-pdf', data, signal);
  return res.blob();
}

/**
 * Starts the server's headless Chrome ahead of the first PDF download, so the
 * serverless cold start overlaps with the user looking at the page. Best effort.
 */
export function warmUpPdf(): void {
  void fetch(`${API_BASE}/api/export-pdf/warm`).catch(() => undefined);
}

export interface GenerateCoverLetterRequestBody {
  uiLanguage: UiLanguage;
  fullName: string;
  jobTitle: string;
  targetRole: string;
  targetCompany: string;
  summary: string;
  strengths: string[];
  experience: { position: string; company: string; description: string }[];
  skills: string[];
}

export interface GenerateCoverLetterResponse {
  content: string;
  generatedAt: string;
}

export async function generateCoverLetter(
  body: GenerateCoverLetterRequestBody,
  signal?: AbortSignal,
): Promise<GenerateCoverLetterResponse> {
  const res = await post('/api/generate-cover-letter', body, signal);
  return res.json() as Promise<GenerateCoverLetterResponse>;
}

export interface ExportCoverLetterPdfBody {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  content: string;
  targetRole: string;
  targetCompany: string;
  selectedThemeId: string;
  colorMode: 'light' | 'dark';
  uiLanguage: UiLanguage;
}

export async function downloadCoverLetterPdf(body: ExportCoverLetterPdfBody, signal?: AbortSignal): Promise<Blob> {
  const res = await post('/api/export-cover-letter-pdf', body, signal);
  return res.blob();
}

export interface TelegramConfig {
  enabled: boolean;
  botUsername?: string;
}

export type TelegramLinkStatus =
  | { state: 'pending' | 'processing' | 'failed' | 'expired' }
  | { state: 'delivered'; chatToken: string };

export async function getTelegramConfig(): Promise<TelegramConfig> {
  const res = await fetch(`${API_BASE}/api/telegram/config`);
  if (!res.ok) return { enabled: false };
  return res.json() as Promise<TelegramConfig>;
}

/** Hands the resume to the server and returns a one-time t.me deep link. */
export async function createTelegramLink(data: ResumeData): Promise<{ token: string; url: string; expiresIn: number }> {
  const res = await post('/api/telegram/link', data);
  return res.json() as Promise<{ token: string; url: string; expiresIn: number }>;
}

export async function getTelegramLinkStatus(token: string): Promise<TelegramLinkStatus> {
  const res = await fetch(`${API_BASE}/api/telegram/status?token=${encodeURIComponent(token)}`);
  if (!res.ok) throw new ApiError('request_failed', res.status);
  return res.json() as Promise<TelegramLinkStatus>;
}

/** Sends straight to a chat linked earlier (its signed token lives in localStorage). */
export async function sendResumeToTelegram(chatToken: string, resume: ResumeData): Promise<void> {
  await post('/api/telegram/send', { chatToken, resume });
}
