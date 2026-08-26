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

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

export async function generateResume(
  body: GenerateResumeRequestBody,
  signal?: AbortSignal,
): Promise<GenerateResumeResponse> {
  const res = await fetch(`${API_BASE}/api/generate-resume`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  });

  if (!res.ok) {
    const payload = (await res.json().catch(() => null)) as { message?: string } | null;
    throw new ApiError(payload?.message ?? 'Не удалось сгенерировать резюме', res.status);
  }

  return res.json() as Promise<GenerateResumeResponse>;
}

export async function downloadResumePdf(data: ResumeData, signal?: AbortSignal): Promise<Blob> {
  const res = await fetch(`${API_BASE}/api/export-pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    signal,
  });

  if (!res.ok) {
    const payload = (await res.json().catch(() => null)) as { message?: string } | null;
    throw new ApiError(payload?.message ?? 'Не удалось сформировать PDF', res.status);
  }

  return res.blob();
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
  const res = await fetch(`${API_BASE}/api/generate-cover-letter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  });

  if (!res.ok) {
    const payload = (await res.json().catch(() => null)) as { message?: string } | null;
    throw new ApiError(payload?.message ?? 'Не удалось сгенерировать письмо', res.status);
  }

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
  const res = await fetch(`${API_BASE}/api/export-cover-letter-pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  });

  if (!res.ok) {
    const payload = (await res.json().catch(() => null)) as { message?: string } | null;
    throw new ApiError(payload?.message ?? 'Не удалось сформировать PDF', res.status);
  }

  return res.blob();
}
