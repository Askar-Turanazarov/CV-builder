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
