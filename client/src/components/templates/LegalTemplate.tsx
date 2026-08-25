import { useTranslation } from 'react-i18next';
import type { ResumeTemplateProps } from '../../types/resume';
import { formatDateRange, formatFullDate } from './shared/dateFormat';
import Section from './shared/Section';
import SkillPill from './shared/SkillPill';
import LanguageBadge from './shared/LanguageBadge';
import ContactLinks from './shared/ContactLinks';
import styles from './LegalTemplate.module.css';

function getSealInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Strict, conservative "letterhead" feel: one top rule, serif, no photo,
// formal register throughout — appropriate for legal/government roles.
export default function LegalTemplate({ data }: ResumeTemplateProps) {
  const { t } = useTranslation('templates');
  const present = t('present');
  const birthDateLabel = data.personalInfo.birthDate ? formatFullDate(data.personalInfo.birthDate, data.uiLanguage) : '';
  const showSignature = Boolean(birthDateLabel || data.contacts.location);

  return (
    <div className={`${styles.page} resume-document`}>
      <div className={styles.topRule} />
      <header className={styles.header}>
        <div className={styles.seal} aria-hidden="true">
          {getSealInitials(data.personalInfo.fullName)}
        </div>
        <h1 className={`${styles.name} resume-name`}>{data.personalInfo.fullName || '—'}</h1>
        <p className={styles.jobTitle}>{data.personalInfo.jobTitle}</p>
        <div className={styles.contactLine}>
          <ContactLinks contacts={data.contacts} variant={data.viewMode === 'site' ? 'buttons' : 'plain'} />
          {birthDateLabel && <span className={styles.birthDate}>{birthDateLabel}</span>}
        </div>
      </header>

      {data.aiContent?.summary && (
        <Section title={t('sections.summary')}>
          <p className={styles.summaryText}>{data.aiContent.summary}</p>
        </Section>
      )}

      {data.experience.length > 0 && (
        <Section title={t('sections.experience')}>
          {data.experience.map((exp) => (
            <div key={exp.id} className={`${styles.entry} resume-entry`}>
              <div className={styles.entryHead}>
                <strong>{exp.company}</strong>
                <span className={styles.entryDate}>{formatDateRange(exp.startDate, exp.endDate, data.uiLanguage, present)}</span>
              </div>
              <div className={styles.entrySub}>{exp.position}</div>
              {exp.description && <p className={styles.entryDescription}>{exp.description}</p>}
            </div>
          ))}
        </Section>
      )}

      {data.education.length > 0 && (
        <Section title={t('sections.education')}>
          {data.education.map((edu) => (
            <div key={edu.id} className={`${styles.entry} resume-entry`}>
              <div className={styles.entryHead}>
                <strong>{edu.institution}</strong>
                <span className={styles.entryDate}>{formatDateRange(edu.startDate, edu.endDate, data.uiLanguage, present)}</span>
              </div>
              <div className={styles.entrySub}>
                {edu.degree}
                {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}
              </div>
            </div>
          ))}
        </Section>
      )}

      {data.aiContent && data.aiContent.strengths.length > 0 && (
        <Section title={t('sections.strengths')}>
          <ul className={styles.strengthList}>
            {data.aiContent.strengths.map((strength, index) => (
              <li key={index}>{strength}</li>
            ))}
          </ul>
        </Section>
      )}

      {data.skills.length > 0 && (
        <Section title={t('sections.skills')}>
          <div className={styles.pillRow}>
            {data.skills.map((skill) => (
              <SkillPill key={skill.id} skill={skill} />
            ))}
          </div>
        </Section>
      )}

      {data.languages.length > 0 && (
        <Section title={t('sections.languages')}>
          <div className={styles.pillRow}>
            {data.languages.map((lang) => (
              <LanguageBadge key={lang.id} language={lang} />
            ))}
          </div>
        </Section>
      )}

      {showSignature && (
        <div className={styles.signatureStrip}>
          <span className={styles.signatureDate}>{birthDateLabel}</span>
          <span className={styles.signatureName}>
            {[data.contacts.location, data.personalInfo.fullName].filter(Boolean).join(' · ')}
          </span>
        </div>
      )}
    </div>
  );
}
