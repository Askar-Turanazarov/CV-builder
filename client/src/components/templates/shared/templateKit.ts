import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import type { ResumeData } from '../../../types/resume';
import { formatDateRange, formatFullDate } from './dateFormat';

/**
 * What every template needs from the resume besides its content: texts in
 * the resume's language (ResumeTemplate already put it into data.uiLanguage),
 * date ranges, and whether contacts are plain text or site buttons.
 */
export function useTemplateKit(data: ResumeData) {
  const { t } = useTranslation('templates');
  const present = t('present');
  return {
    t,
    range: (start: string, end: string | null) => formatDateRange(start, end, data.uiLanguage, present),
    birthDate: data.personalInfo.birthDate ? formatFullDate(data.personalInfo.birthDate, data.uiLanguage) : '',
    contactVariant: data.viewMode === 'site' ? ('buttons' as const) : ('plain' as const),
    summary: data.aiContent?.summary ?? '',
    strengths: data.aiContent?.strengths ?? [],
  };
}

/** "Жасур Нурматов" → "ЖН" */
export function initials(fullName: string): string {
  return (
    fullName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('') || '—'
  );
}

/** "2021-03" → "2021"; an open end is the current year */
export function yearOf(value: string | null): string {
  return value ? value.slice(0, 4) : String(new Date().getFullYear());
}

/** Description text split into its lines, without leading bullet marks */
export function descriptionLines(text: string | undefined): string[] {
  return (text ?? '')
    .split('\n')
    .map((line) => line.replace(/^\s*[•\-–*]\s*/, '').trim())
    .filter(Boolean);
}

/** Years since the earliest job started, at least 1 (0 when there are no jobs) */
export function careerYears(data: ResumeData): number {
  if (data.experience.length === 0) return 0;
  const first = Math.min(...data.experience.map((exp) => Number(yearOf(exp.startDate))));
  return Math.max(1, new Date().getFullYear() - first);
}

/** Whole months from "yyyy-mm" to "yyyy-mm" (an open end is now), at least 1 */
export function tenureMonths(start: string, end: string | null): number {
  const [sy, sm] = start.split('-').map(Number);
  const now = new Date();
  const [ey, em] = end ? end.split('-').map(Number) : [now.getFullYear(), now.getMonth() + 1];
  const months = (ey - sy) * 12 + ((em || 1) - (sm || 1));
  return Number.isFinite(months) ? Math.max(1, months) : 1;
}

/**
 * The name's longest word as a `--word` CSS variable, for poster-size names
 * whose font shrinks until that word fits on one line instead of breaking
 */
export function longestWordStyle(fullName: string): CSSProperties {
  const longest = Math.max(1, ...fullName.split(/\s+/).map((word) => word.length));
  return { '--word': longest } as CSSProperties;
}
