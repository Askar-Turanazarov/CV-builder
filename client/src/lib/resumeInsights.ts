import type { ResumeData, TemplateId } from '../types/resume';
import type { StepKey } from '../components/form/FormWizard';
import { templateRegistry, type TemplateAudience } from '../components/templates/templateRegistry';

export interface ChecklistItem {
  key: string;
  done: boolean;
  labelKey: string;
  tipKey: string;
  stepKey: StepKey;
}

const MIN_DESCRIPTION_LENGTH = 40;
const MIN_SKILLS = 3;

/**
 * Pure, side-effect-free — takes a snapshot of `ResumeData` and returns the
 * checklist state. Doesn't know about React/the store, so it's trivial to
 * call from the Preview page's insights panel (and to test).
 */
export function getResumeChecklist(data: ResumeData): ChecklistItem[] {
  return [
    {
      key: 'photo',
      done: data.personalInfo.photo !== null,
      labelKey: 'checklist.photo.label',
      tipKey: 'checklist.photo.tip',
      stepKey: 'personal',
    },
    {
      key: 'contacts',
      done: data.contacts.email.trim() !== '' && data.contacts.phone.trim() !== '',
      labelKey: 'checklist.contacts.label',
      tipKey: 'checklist.contacts.tip',
      stepKey: 'contacts',
    },
    {
      key: 'experience',
      done: data.experience.length > 0,
      labelKey: 'checklist.experience.label',
      tipKey: 'checklist.experience.tip',
      stepKey: 'experience',
    },
    {
      key: 'experienceDescriptions',
      done:
        data.experience.length > 0 &&
        data.experience.every((exp) => exp.description.trim().length >= MIN_DESCRIPTION_LENGTH),
      labelKey: 'checklist.experienceDescriptions.label',
      tipKey: 'checklist.experienceDescriptions.tip',
      stepKey: 'experience',
    },
    {
      key: 'education',
      done: data.education.length > 0,
      labelKey: 'checklist.education.label',
      tipKey: 'checklist.education.tip',
      stepKey: 'education',
    },
    {
      key: 'skills',
      done: data.skills.length >= MIN_SKILLS,
      labelKey: 'checklist.skills.label',
      tipKey: 'checklist.skills.tip',
      stepKey: 'skills',
    },
    {
      key: 'languages',
      done: data.languages.length > 0,
      labelKey: 'checklist.languages.label',
      tipKey: 'checklist.languages.tip',
      stepKey: 'languages',
    },
    {
      key: 'aiContent',
      done: data.aiContent !== null,
      labelKey: 'checklist.aiContent.label',
      tipKey: 'checklist.aiContent.tip',
      stepKey: 'review',
    },
  ];
}

export interface ResumeScore {
  done: number;
  total: number;
  percent: number;
}

export function getResumeScore(checklist: ChecklistItem[]): ResumeScore {
  const done = checklist.filter((item) => item.done).length;
  const total = checklist.length;
  return { done, total, percent: total === 0 ? 0 : Math.round((done / total) * 100) };
}

export type LengthVerdict = 'fits' | 'tight' | 'overflow';

/**
 * Rough character-count heuristic, NOT a real layout calculation — actual
 * page count depends heavily on which of the 40 templates is selected.
 * Deliberately framed as an estimate in the UI copy ("вероятно",
 * "скорее всего"), not a guarantee.
 */
export function estimateLengthVerdict(data: ResumeData): LengthVerdict {
  const experienceLength = data.experience.reduce((sum, exp) => sum + exp.description.length, 0);
  const educationLength = data.education.reduce((sum, edu) => sum + (edu.description?.length ?? 0), 0);
  const summaryLength = data.aiContent?.summary.length ?? 0;
  const strengthsLength = data.aiContent?.strengths.join(' ').length ?? 0;

  const total = experienceLength + educationLength + summaryLength + strengthsLength;

  if (total <= 1800) return 'fits';
  if (total <= 3000) return 'tight';
  return 'overflow';
}

const ROLE_KEYWORDS: Partial<Record<TemplateAudience, string[]>> = {
  tech: [
    'разработчик',
    'программист',
    'инженер',
    'devops',
    'developer',
    'engineer',
    'programmer',
    'dasturchi',
    'muhandis',
  ],
  creative: [
    'дизайнер',
    'designer',
    'дизайн',
    'ux',
    'ui',
    'иллюстратор',
    'dizayner',
  ],
  legal: ['юрист', 'юридич', 'lawyer', 'legal', 'advokat', 'huquqshunos'],
  finance: [
    'бухгалтер',
    'финанс',
    'accountant',
    'finance',
    'financial',
    'buxgalter',
    'moliya',
  ],
  healthcare: ['врач', 'медсестра', 'doctor', 'medical', 'nurse', 'shifokor', 'tibbiyot'],
  academia: ['преподаватель', 'учитель', 'teacher', 'professor', 'researcher', 'o‘qituvchi', 'ilmiy'],
  'sales-marketing': [
    'маркетолог',
    'маркетинг',
    'marketing',
    'sales',
    'продажи',
    'marketolog',
    'sotuv',
  ],
  corporate: ['менеджер', 'руководитель', 'manager', 'director', 'ceo', 'rahbar'],
  nonprofit: ['ngo', 'некоммерч', 'volunteer', 'волонт', 'nonprofit'],
  startup: ['стартап', 'startup', 'founder', 'основатель'],
};

/**
 * Best-effort nudge, not a hard rule — matches whole substrings of the
 * (lowercased) job title against a small keyword list per audience tag,
 * across the languages the app already supports. Returns up to 3
 * templates carrying a matched audience tag, excluding whatever is
 * currently selected. Empty result just means "no confident match" — the
 * panel simply doesn't show the section rather than guessing.
 */
export function suggestTemplatesForRole(jobTitle: string, currentTemplateId: TemplateId): TemplateId[] {
  const normalized = jobTitle.trim().toLowerCase();
  if (!normalized) return [];

  const matchedAudiences = (Object.keys(ROLE_KEYWORDS) as TemplateAudience[]).filter((audience) =>
    ROLE_KEYWORDS[audience]?.some((keyword) => normalized.includes(keyword)),
  );
  if (matchedAudiences.length === 0) return [];

  const matches = templateRegistry.filter(
    (definition) => definition.id !== currentTemplateId && definition.audience.some((a) => matchedAudiences.includes(a)),
  );

  return matches.slice(0, 3).map((definition) => definition.id);
}
