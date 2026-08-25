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
