import { useTranslation } from 'react-i18next';
import type { ResumeTemplateProps } from '../../types/resume';
import { formatDateRange, formatFullDate } from './shared/dateFormat';
import Section from './shared/Section';
import SkillPill from './shared/SkillPill';
import LanguageBadge from './shared/LanguageBadge';
import ContactLinks from './shared/ContactLinks';
import styles from './ConsultantTemplate.module.css';

// Consulting-firm style: thin rules, tight grid, restrained grayscale with a
// single accent underline — reads like a strategy deck, not a portfolio.
export default function ConsultantTemplate({ data }: ResumeTemplateProps) {
  const { t } = useTranslation('templates');
  const present = t('present');

  return (
    <div className={`${styles.page} resume-document`}>
      <header className={styles.header}>
        <div>
          <h1 className={`${styles.name} resume-name`}>{data.personalInfo.fullName || '—'}</h1>
          <p className={styles.jobTitle}>{data.personalInfo.jobTitle}</p>
        </div>
        <div className={styles.contactList}>
          <ContactLinks contacts={data.contacts} variant={data.viewMode === 'site' ? 'buttons' : 'plain'} />
          {data.personalInfo.birthDate && (
            <span className={styles.birthDate}>{formatFullDate(data.personalInfo.birthDate, data.uiLanguage)}</span>
          )}
        </div>
      </header>
      <div className={styles.headerRule} />

      {data.aiContent?.summary && (
        <Section title={t('sections.summary')}>
          <p className={styles.summaryText}>{data.aiContent.summary}</p>
        </Section>
      )}

      {data.aiContent && data.aiContent.strengths.length > 0 && (
        <section className={`${styles.callouts} resume-section`}>
          <h3>{t('sections.strengths')}</h3>
          {/* Stat-callout tiles in a responsive row, instead of a bulleted
              or two-column list — each strength reads as its own card. */}
          <div className={styles.calloutRow}>
            {data.aiContent.strengths.map((strength, index) => (
              <div key={index} className={styles.calloutCard}>
                <span className={styles.calloutIndex}>{String(index + 1).padStart(2, '0')}</span>
                <span>{strength}</span>
              </div>
            ))}
          </div>
        </section>
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
    </div>
  );
}
