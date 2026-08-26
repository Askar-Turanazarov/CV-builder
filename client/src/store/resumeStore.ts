import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import {
  createEmptyResumeData,
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
  type CoverLetterContent,
} from '../types/resume';

// Bumped independently from `types/resume.ts`'s CURRENT_SCHEMA_VERSION —
// that one guards ResumeData's own shape; this one guards the STORE's
// shape (the move from a single `data` to a named `resumes` collection).
// A version bump here is what makes zustand/persist actually invoke
// `migrate` below for anyone who saved under the old, single-resume shape.
const STORE_SCHEMA_VERSION = 2;

const DEFAULT_RESUME_ID = 'default';

interface ResumeStore {
  resumes: Record<string, ResumeData>;
  resumeNames: Record<string, string>;
  activeResumeId: string;
  /** Always equals `resumes[activeResumeId]` — kept as its own field (not a
   * derived getter) so every existing consumer that reads `s.data` keeps
   * working unchanged; every setter below updates both together. */
  data: ResumeData;
  setPersonalInfo: (patch: Partial<ResumeData['personalInfo']>) => void;
  setContacts: (patch: Partial<ResumeData['contacts']>) => void;
  setExperience: (entries: ExperienceEntry[]) => void;
  setEducation: (entries: EducationEntry[]) => void;
  setSkills: (entries: SkillEntry[]) => void;
  setLanguages: (entries: LanguageEntry[]) => void;
  setAiContent: (content: AiGeneratedContent | null) => void;
  setCoverLetter: (content: CoverLetterContent | null) => void;
  setTemplate: (id: TemplateId) => void;
  setTheme: (id: ThemeId) => void;
  setColorMode: (mode: ColorMode) => void;
  setViewMode: (mode: ViewMode) => void;
  setUiLanguage: (lang: UiLanguage) => void;
  setUiDesignSystem: (design: UiDesignSystem) => void;
  reset: () => void;
  /** Creates a new, empty resume with the given display name, makes it the
   * active one, and returns its id. */
  createResume: (name: string) => string;
  /** Copies an existing resume's data under a new name (kept separate,
   * editing one never touches the other) and returns the new id. Does NOT
   * switch to it — callers decide whether to. */
  duplicateResume: (id: string, newName: string) => string;
  renameResume: (id: string, name: string) => void;
  /** Deletes a resume. If it was the active one, switches to another
   * remaining resume, or creates a fresh empty one if it was the last. */
  deleteResume: (id: string) => void;
  switchResume: (id: string) => void;
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
    (set, get) => {
      /** Shared by every field-level setter: applies `updater` to the
       * currently active resume's data and writes the result to both
       * `resumes[activeResumeId]` and the `data` mirror in one `set` call. */
      const updateActive = (updater: (data: ResumeData) => ResumeData) => {
        const state = get();
        const nextData = updater(state.data);
        set({
          data: nextData,
          resumes: { ...state.resumes, [state.activeResumeId]: nextData },
        });
      };

      const initialData = createEmptyResumeData();

      return {
        resumes: { [DEFAULT_RESUME_ID]: initialData },
        resumeNames: { [DEFAULT_RESUME_ID]: 'Resume 1' },
        activeResumeId: DEFAULT_RESUME_ID,
        data: initialData,

        setPersonalInfo: (patch) => updateActive((data) => ({ ...data, personalInfo: { ...data.personalInfo, ...patch } })),
        setContacts: (patch) => updateActive((data) => ({ ...data, contacts: { ...data.contacts, ...patch } })),
        setExperience: (entries) => updateActive((data) => ({ ...data, experience: entries })),
        setEducation: (entries) => updateActive((data) => ({ ...data, education: entries })),
        setSkills: (entries) => updateActive((data) => ({ ...data, skills: entries })),
        setLanguages: (entries) => updateActive((data) => ({ ...data, languages: entries })),
        setAiContent: (content) => updateActive((data) => ({ ...data, aiContent: content })),
        setCoverLetter: (content) => updateActive((data) => ({ ...data, coverLetter: content })),
        setTemplate: (id) => updateActive((data) => ({ ...data, selectedTemplateId: id })),
        setTheme: (id) => updateActive((data) => ({ ...data, selectedThemeId: id })),
        setColorMode: (mode) => updateActive((data) => ({ ...data, colorMode: mode })),
        setViewMode: (mode) => updateActive((data) => ({ ...data, viewMode: mode })),
        setUiLanguage: (lang) => updateActive((data) => ({ ...data, uiLanguage: lang })),
        setUiDesignSystem: (design) => updateActive((data) => ({ ...data, uiDesignSystem: design })),
        reset: () => updateActive(() => createEmptyResumeData()),

        createResume: (name) => {
          const id = crypto.randomUUID();
          const newData = createEmptyResumeData();
          set((s) => ({
            resumes: { ...s.resumes, [id]: newData },
            resumeNames: { ...s.resumeNames, [id]: name },
            activeResumeId: id,
            data: newData,
          }));
          return id;
        },

        duplicateResume: (id, newName) => {
          const source = get().resumes[id];
          const newId = crypto.randomUUID();
          set((s) => ({
            resumes: { ...s.resumes, [newId]: { ...(source ?? createEmptyResumeData()) } },
            resumeNames: { ...s.resumeNames, [newId]: newName },
          }));
          return newId;
        },

        renameResume: (id, name) => set((s) => ({ resumeNames: { ...s.resumeNames, [id]: name } })),

        deleteResume: (id) => {
          set((s) => {
            const resumes = { ...s.resumes };
            const resumeNames = { ...s.resumeNames };
            delete resumes[id];
            delete resumeNames[id];

            if (s.activeResumeId !== id) {
              return { resumes, resumeNames };
            }

            const remainingIds = Object.keys(resumes);
            if (remainingIds.length > 0) {
              const nextActiveId = remainingIds[0];
              return { resumes, resumeNames, activeResumeId: nextActiveId, data: resumes[nextActiveId] };
            }

            const freshId = crypto.randomUUID();
            const freshData = createEmptyResumeData();
            return {
              resumes: { [freshId]: freshData },
              resumeNames: { [freshId]: 'Resume 1' },
              activeResumeId: freshId,
              data: freshData,
            };
          });
        },

        switchResume: (id) => {
          set((s) => {
            const target = s.resumes[id];
            if (!target) return s;
            return { activeResumeId: id, data: target };
          });
        },
      };
    },
    {
      name: 'resume-builder:v1',
      version: STORE_SCHEMA_VERSION,
      storage: createJSONStorage(() => createDebouncedStorage(400)),
      // Runs only when a persisted blob's own `version` differs from
      // STORE_SCHEMA_VERSION — this is where the one-time shape change
      // (single `data` -> named `resumes` collection) is handled, so
      // nobody's existing resume disappears when this feature ships.
      migrate: (persistedState) => {
        const persisted = persistedState as { data?: ResumeData; resumes?: Record<string, ResumeData> } | undefined;
        if (!persisted) return persisted;
        if (!persisted.resumes) {
          const oldData = persisted.data ?? createEmptyResumeData();
          return {
            resumes: { [DEFAULT_RESUME_ID]: oldData },
            resumeNames: { [DEFAULT_RESUME_ID]: 'Resume 1' },
            activeResumeId: DEFAULT_RESUME_ID,
            data: oldData,
          };
        }
        return persisted;
      },
      // Deep-merge `data` specifically: a field added to ResumeData after a
      // user already has persisted state (e.g. uiDesignSystem) should fall
      // back to the fresh default rather than being `undefined`.
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<ResumeStore> | undefined;
        return {
          ...currentState,
          ...persisted,
          resumes: persisted?.resumes ?? currentState.resumes,
          resumeNames: persisted?.resumeNames ?? currentState.resumeNames,
          data: persisted?.data ? { ...currentState.data, ...persisted.data } : currentState.data,
        };
      },
    },
  ),
);
