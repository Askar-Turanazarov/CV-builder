import i18n from '../i18n';
import type { ResumeData } from '../types/resume';
import { formatDateRange } from '../components/templates/shared/dateFormat';

/**
 * Plain-text version of the resume — for pasting into job-portal application
 * forms that only accept typed/pasted text, not a file upload. Reuses the
 * same section labels/date formatting the templates already render, in
 * whichever language the resume itself is currently set to (`data.uiLanguage`),
 * not necessarily the browser's current UI language.
 */
export function buildResumePlainText(data: ResumeData): string {
  const lng = data.uiLanguage;
  const t = (key: string) => i18n.t(key, { lng, ns: 'templates' });
  const present = t('present');
  const lines: string[] = [];

  const { personalInfo, contacts } = data;
  lines.push(personalInfo.fullName || '—');
  if (personalInfo.jobTitle) lines.push(personalInfo.jobTitle);
  lines.push('');

  const contactBits = [contacts.email, contacts.phone, contacts.location, contacts.website, contacts.linkedin, contacts.telegram, contacts.github].filter(
    Boolean,
  );
  if (contactBits.length > 0) {
    lines.push(contactBits.join(' · '));
    lines.push('');
  }

  if (data.aiContent?.summary) {
    lines.push(t('sections.summary').toUpperCase());
    lines.push(data.aiContent.summary);
    lines.push('');
  }

  if (data.aiContent && data.aiContent.strengths.length > 0) {
    lines.push(t('sections.strengths').toUpperCase());
    for (const strength of data.aiContent.strengths) lines.push(`- ${strength}`);
    lines.push('');
  }

  if (data.experience.length > 0) {
    lines.push(t('sections.experience').toUpperCase());
    for (const exp of data.experience) {
      lines.push(`${exp.position}, ${exp.company}${exp.location ? ` (${exp.location})` : ''}`);
      lines.push(formatDateRange(exp.startDate, exp.endDate, lng, present));
      if (exp.description) lines.push(exp.description);
      lines.push('');
    }
  }

  if (data.education.length > 0) {
    lines.push(t('sections.education').toUpperCase());
    for (const edu of data.education) {
      lines.push(`${edu.degree}${edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''} — ${edu.institution}`);
      lines.push(formatDateRange(edu.startDate, edu.endDate, lng, present));
      if (edu.description) lines.push(edu.description);
      lines.push('');
    }
  }

  if (data.skills.length > 0) {
    lines.push(t('sections.skills').toUpperCase());
    lines.push(data.skills.map((skill) => skill.name).join(', '));
    lines.push('');
  }

  if (data.languages.length > 0) {
    lines.push(t('sections.languages').toUpperCase());
    lines.push(data.languages.map((lang) => `${lang.name} — ${lang.level}`).join(', '));
    lines.push('');
  }

  return lines.join('\n').trim();
}

export async function copyResumeAsText(data: ResumeData): Promise<void> {
  const text = buildResumePlainText(data);
  await navigator.clipboard.writeText(text);
}
