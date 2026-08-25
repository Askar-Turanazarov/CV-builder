export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  birthDate: string; // ISO yyyy-mm-dd
  photo: string | null; // base64 data URL, resized/compressed client-side
}

export interface ContactInfo {
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  telegram?: string;
  github?: string;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  position: string;
  startDate: string; // yyyy-mm
  endDate: string | null; // null = по настоящее время
  isCurrent: boolean;
  location?: string;
  description: string;
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate: string | null;
  description?: string;
}

export interface SkillEntry {
  id: string;
  name: string;
  level?: 1 | 2 | 3 | 4 | 5;
}

export type LanguageLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'native';

export interface LanguageEntry {
  id: string;
  name: string;
  level: LanguageLevel;
}

export interface AiGeneratedContent {
  summary: string;
  strengths: string[];
  generatedAt: string;
  sourceHash: string;
}

export type TemplateId =
  | 'classic'
  | 'sidebar'
  | 'minimal'
  | 'timeline'
  | 'compact'
  // 20 popular styles
  | 'harvard'
  | 'executive'
  | 'consultant'
  | 'academic'
  | 'two-column-photo'
  | 'dark-sidebar'
  | 'functional'
  | 'hybrid'
  | 'gradient-header'
  | 'swiss-minimal'
  | 'elegant-serif'
  | 'color-block'
  | 'developer'
  | 'sales-vibrant'
  | 'startup'
  | 'healthcare'
  | 'legal'
  | 'nonprofit'
  | 'photo-portrait'
  | 'two-page'
  // 5 unusual styles
  | 'terminal'
  | 'poster'
  | 'editorial'
  | 'ultra-card'
  | 'diagonal'
  // 6 more popular styles
  | 'split-duo'
  | 'badge-initials'
  | 'card-grid'
  | 'ribbon-corner'
  | 'icon-rail'
  | 'ledger'
  // 4 more unusual styles
  | 'radial-timeline'
  | 'scrapbook'
  | 'dashboard-stats'
  | 'blueprint';
export type ThemeId = 'blue' | 'emerald' | 'graphite' | 'sunset';
export type ColorMode = 'light' | 'dark';
export type ViewMode = 'document' | 'site';
export type UiLanguage = 'ru' | 'en' | 'uz';
// Independent from the resume document's own template/theme: this is the
// *app's* own chrome skin (landing, header, wizard, preview controls). The
// resume document templates never change based on this.
export type UiDesignSystem = 'classic' | 'glass';

export interface ResumeData {
  schemaVersion: number;
  personalInfo: PersonalInfo;
  contacts: ContactInfo;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: SkillEntry[];
  languages: LanguageEntry[];
  aiContent: AiGeneratedContent | null;
  selectedTemplateId: TemplateId;
  selectedThemeId: ThemeId;
  colorMode: ColorMode;
  viewMode: ViewMode;
  uiLanguage: UiLanguage;
  uiDesignSystem: UiDesignSystem;
}

export interface ResumeTemplateProps {
  data: ResumeData;
}

export const CURRENT_SCHEMA_VERSION = 1;

export function createEmptyResumeData(): ResumeData {
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    personalInfo: {
      fullName: '',
      jobTitle: '',
      birthDate: '',
      photo: null,
    },
    contacts: {
      email: '',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
      telegram: '',
      github: '',
    },
    experience: [],
    education: [],
    skills: [],
    languages: [],
    aiContent: null,
    selectedTemplateId: 'classic',
    selectedThemeId: 'blue',
    colorMode: 'light',
    viewMode: 'document',
    uiLanguage: 'ru',
    uiDesignSystem: 'classic',
  };
}
