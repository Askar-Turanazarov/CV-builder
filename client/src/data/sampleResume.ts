import type { ResumeData, UiLanguage } from '../types/resume';
import { getShowcaseResumes } from './showcaseResumes';

/**
 * A filled-in resume used wherever a template has to be shown before the
 * visitor has written anything (gallery thumbnails, empty preview) — an
 * empty ResumeData makes every template look like a blank rectangle.
 * Keeps the given resume's look (template/theme/colour mode).
 */
export function getSampleResume(lang: UiLanguage, look?: Partial<ResumeData>): ResumeData {
  const [sample] = getShowcaseResumes(lang);
  return {
    ...sample,
    ...(look && {
      selectedTemplateId: look.selectedTemplateId ?? sample.selectedTemplateId,
      selectedThemeId: look.selectedThemeId ?? sample.selectedThemeId,
      colorMode: look.colorMode ?? sample.colorMode,
    }),
  };
}

/** True while the user hasn't entered anything a template could render. */
export function isResumeEmpty(data: ResumeData): boolean {
  return (
    !data.personalInfo.fullName.trim() &&
    !data.personalInfo.jobTitle.trim() &&
    data.experience.length === 0 &&
    data.education.length === 0 &&
    data.skills.length === 0 &&
    !data.aiContent
  );
}
