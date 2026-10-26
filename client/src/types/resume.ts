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

export interface CoverLetterContent {
  content: string;
  targetRole: string;
  targetCompany: string;
  generatedAt: string | null;
}

export type TemplateId =
  // Popular: distinct layouts for everyday applications
  | 'classic'
  | 'harvard'
  | 'compact'
  | 'two-column-photo'
  | 'dark-sidebar'
  | 'gradient-header'
  | 'elegant-serif'
  | 'card-grid'
  | 'ledger'
  | 'magazine'
  | 'monogram'
  | 'year-scale'
  | 'photo-card'
  | 'bauhaus'
  | 'zen'
  | 'skill-radar'
  | 'ribbon-header'
  | 'portfolio'
  | 'letterhead'
  | 'nordic'
  | 'marginalia'
  | 'typewriter'
  | 'deck'
  | 'zigzag'
  // Unusual: bold looks that still read as a resume
  | 'terminal'
  | 'poster'
  | 'ultra-card'
  | 'diagonal'
  | 'scrapbook'
  | 'dashboard-stats'
  | 'blueprint'
  | 'bento'
  | 'outline'
  | 'spine'
  | 'riso'
  | 'brutal'
  // Concept: the whole resume told as another kind of object
  | 'metro'
  | 'ide'
  | 'newspaper'
  | 'boarding-pass'
  | 'chat'
  | 'menu'
  | 'star-map'
  | 'encyclopedia'
  | 'nutrition'
  | 'album'
  | 'periodic'
  | 'character-sheet';
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
  coverLetter: CoverLetterContent | null;
  selectedTemplateId: TemplateId;
  selectedThemeId: ThemeId;
  colorMode: ColorMode;
  viewMode: ViewMode;
  uiLanguage: UiLanguage;
  /** Language of the resume itself (headings, dates). Unset = same as the interface. */
  resumeLanguage?: UiLanguage;
  uiDesignSystem: UiDesignSystem;
}

export interface ResumeTemplateProps {
  data: ResumeData;
}

export function getResumeLanguage(data: Pick<ResumeData, 'uiLanguage' | 'resumeLanguage'>): UiLanguage {
  return data.resumeLanguage ?? data.uiLanguage;
}

const CURRENT_SCHEMA_VERSION = 1;

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
    coverLetter: null,
    selectedTemplateId: 'classic',
    selectedThemeId: 'blue',
    colorMode: 'light',
    viewMode: 'document',
    uiLanguage: 'ru',
    uiDesignSystem: 'glass',
  };
}
