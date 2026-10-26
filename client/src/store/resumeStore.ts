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
import { resolveTemplateId } from '../data/legacyTemplates';

// Bumped independently from `types/resume.ts`'s CURRENT_SCHEMA_VERSION —
// that one guards ResumeData's own shape; this one guards the STORE's
// shape (the move from a single `data` to a named `resumes` collection).
// A version bump here is what makes zustand/persist actually invoke
// `migrate` below for anyone who saved under the old, single-resume shape.
const STORE_SCHEMA_VERSION = 3;

const DEFAULT_RESUME_ID = 'default';

type UiPrefKey = 'uiLanguage' | 'uiDesignSystem' | 'colorMode';

function pickUiPrefs(data: ResumeData): Pick<ResumeData, UiPrefKey> {
  return { uiLanguage: data.uiLanguage, uiDesignSystem: data.uiDesignSystem, colorMode: data.colorMode };
}

// Removed templates map to their closest successor on every load: cheaper
// than a schema bump, and it also covers resumes saved by an older tab
function withCurrentTemplate(data: ResumeData): ResumeData {
  const id = resolveTemplateId(data.selectedTemplateId);
  return id === data.selectedTemplateId ? data : { ...data, selectedTemplateId: id };
}

function toGlassDefault<T extends { data?: ResumeData; resumes?: Record<string, ResumeData> }>(state: T): T {
  const glass = (data: ResumeData): ResumeData => ({ ...data, uiDesignSystem: 'glass' });
  return {
    ...state,
    data: state.data && glass(state.data),
    resumes: state.resumes && Object.fromEntries(Object.entries(state.resumes).map(([id, d]) => [id, glass(d)])),
  };
}

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
  /** null = follow the interface language */
  setResumeLanguage: (lang: UiLanguage | null) => void;
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

      /** Interface preferences (language, design, light/dark) live on each
       * resume's data for historical reasons, but they're app-wide: a change
       * is applied to every resume so switching resumes doesn't flip the UI. */
      const updateUiPrefs = (patch: Partial<Pick<ResumeData, UiPrefKey>>) => {
        const state = get();
        const resumes = Object.fromEntries(
          Object.entries(state.resumes).map(([id, data]) => [id, { ...data, ...patch }]),
        );
        set({ resumes, data: { ...state.data, ...patch } });
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
        setColorMode: (mode) => updateUiPrefs({ colorMode: mode }),
        setViewMode: (mode) => updateActive((data) => ({ ...data, viewMode: mode })),
        setUiLanguage: (lang) => updateUiPrefs({ uiLanguage: lang }),
        setResumeLanguage: (lang) => updateActive((data) => ({ ...data, resumeLanguage: lang ?? undefined })),
        setUiDesignSystem: (design) => updateUiPrefs({ uiDesignSystem: design }),
        reset: () => updateActive((data) => ({ ...createEmptyResumeData(), ...pickUiPrefs(data) })),

        createResume: (name) => {
          const id = crypto.randomUUID();
          const newData = { ...createEmptyResumeData(), ...pickUiPrefs(get().data) };
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
            const freshData = { ...createEmptyResumeData(), ...pickUiPrefs(s.data) };
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
      migrate: (persistedState, version) => {
        let persisted = persistedState as { data?: ResumeData; resumes?: Record<string, ResumeData> } | undefined;
        if (!persisted) return persisted;
        // v3: Glass became the default interface design; the old default
        // (classic) was almost never an explicit choice, so move everyone over.
        if (version < 3) persisted = toGlassDefault(persisted);
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
          resumes: persisted?.resumes
            ? Object.fromEntries(Object.entries(persisted.resumes).map(([id, d]) => [id, withCurrentTemplate(d)]))
            : currentState.resumes,
          resumeNames: persisted?.resumeNames ?? currentState.resumeNames,
          data: persisted?.data ? withCurrentTemplate({ ...currentState.data, ...persisted.data }) : currentState.data,
        };
      },
    },
  ),
);
