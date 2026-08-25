import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import {
  createEmptyResumeData,
  CURRENT_SCHEMA_VERSION,
  type ResumeData,
  type TemplateId,
  type ThemeId,
  type ColorMode,
  type ViewMode,
  type UiLanguage,
  type UiDesignSystem,
  type ExperienceEntry,
  type EducationEntry,
  type SkillEntry,
  type LanguageEntry,
  type AiGeneratedContent,
} from '../types/resume';

interface ResumeStore {
  data: ResumeData;
  setPersonalInfo: (patch: Partial<ResumeData['personalInfo']>) => void;
  setContacts: (patch: Partial<ResumeData['contacts']>) => void;
  setExperience: (entries: ExperienceEntry[]) => void;
  setEducation: (entries: EducationEntry[]) => void;
  setSkills: (entries: SkillEntry[]) => void;
  setLanguages: (entries: LanguageEntry[]) => void;
  setAiContent: (content: AiGeneratedContent | null) => void;
  setTemplate: (id: TemplateId) => void;
  setTheme: (id: ThemeId) => void;
  setColorMode: (mode: ColorMode) => void;
  setViewMode: (mode: ViewMode) => void;
  setUiLanguage: (lang: UiLanguage) => void;
  setUiDesignSystem: (design: UiDesignSystem) => void;
  reset: () => void;
}

/**
 * Batches writes to localStorage on a short timer so rapid typing doesn't
 * trigger a setItem on every keystroke.
 */
function createDebouncedStorage(delayMs: number): StateStorage {
  const timers = new Map<string, ReturnType<typeof setTimeout>>();
  return {
    getItem: (name) => localStorage.getItem(name),
    removeItem: (name) => {
      const timer = timers.get(name);
      if (timer) clearTimeout(timer);
      localStorage.removeItem(name);
    },
    setItem: (name, value) => {
      const existing = timers.get(name);
      if (existing) clearTimeout(existing);
      timers.set(
        name,
        setTimeout(() => {
          localStorage.setItem(name, value);
          timers.delete(name);
        }, delayMs),
      );
    },
  };
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      data: createEmptyResumeData(),
      setPersonalInfo: (patch) =>
        set((s) => ({ data: { ...s.data, personalInfo: { ...s.data.personalInfo, ...patch } } })),
      setContacts: (patch) => set((s) => ({ data: { ...s.data, contacts: { ...s.data.contacts, ...patch } } })),
      setExperience: (entries) => set((s) => ({ data: { ...s.data, experience: entries } })),
      setEducation: (entries) => set((s) => ({ data: { ...s.data, education: entries } })),
      setSkills: (entries) => set((s) => ({ data: { ...s.data, skills: entries } })),
      setLanguages: (entries) => set((s) => ({ data: { ...s.data, languages: entries } })),
      setAiContent: (content) => set((s) => ({ data: { ...s.data, aiContent: content } })),
      setTemplate: (id) => set((s) => ({ data: { ...s.data, selectedTemplateId: id } })),
      setTheme: (id) => set((s) => ({ data: { ...s.data, selectedThemeId: id } })),
      setColorMode: (mode) => set((s) => ({ data: { ...s.data, colorMode: mode } })),
      setViewMode: (mode) => set((s) => ({ data: { ...s.data, viewMode: mode } })),
      setUiLanguage: (lang) => set((s) => ({ data: { ...s.data, uiLanguage: lang } })),
      setUiDesignSystem: (design) => set((s) => ({ data: { ...s.data, uiDesignSystem: design } })),
      reset: () => set({ data: createEmptyResumeData() }),
    }),
    {
      name: 'resume-builder:v1',
      version: CURRENT_SCHEMA_VERSION,
      storage: createJSONStorage(() => createDebouncedStorage(400)),
      // Bump CURRENT_SCHEMA_VERSION and add a branch here whenever ResumeData's
      // shape changes in a way older persisted data can't satisfy as-is.
      migrate: (persistedState) => persistedState as ResumeStore,
      // Deep-merge `data` specifically: a field added to ResumeData after a
      // user already has persisted state (e.g. uiDesignSystem) should fall
      // back to the fresh default rather than being `undefined`.
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<ResumeStore> | undefined;
        return {
          ...currentState,
          ...persisted,
          data: { ...currentState.data, ...persisted?.data },
        };
      },
    },
  ),
);
