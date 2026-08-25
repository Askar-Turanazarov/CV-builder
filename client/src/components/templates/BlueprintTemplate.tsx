import { useTranslation } from 'react-i18next';
import type { ResumeTemplateProps } from '../../types/resume';
import { formatDateRange, formatFullDate } from './shared/dateFormat';
import Section from './shared/Section';
import SkillPill from './shared/SkillPill';
import LanguageBadge from './shared/LanguageBadge';
import ContactLinks from './shared/ContactLinks';
import styles from './BlueprintTemplate.module.css';

// A technical-drawing aesthetic: fine graph-paper background, monospace
// annotation-style headings with corner-bracket marks, and the theme's
// accent color used as the "ink" throughout — so it reads as a classic
// cyan blueprint under the default theme but re-tints correctly whenever
// the color theme changes (see TerminalTemplate for the same principle
// applied to a dark terminal aesthetic).
export default function BlueprintTemplate({ data }: ResumeTemplateProps) {
  const { t } = useTranslation('templates');
  const present = t('present');

  return (
    <div className={`${styles.page} resume-document ${data.viewMode === 'site' ? styles.site : styles.document}`}>
      <header className={styles.header}>
        <div className={`${styles.photoWrap} resume-photo`}>
          {data.personalInfo.photo ? (
            <img src={data.personalInfo.photo} alt={data.personalInfo.fullName} />
          ) : (
            <span className={styles.photoPlaceholder}>{t('noPhoto')}</span>
          )}
        </div>
        <div className={styles.headerText}>
          <h1 className={`${styles.name} resume-name`}>{data.personalInfo.fullName || '—'}</h1>
          <p className={styles.jobTitle}>{data.personalInfo.jobTitle}</p>
          <ContactLinks
            contacts={data.contacts}
            variant={data.viewMode === 'site' ? 'buttons' : 'plain'}
            className={styles.contactRow}
          />
          {data.personalInfo.birthDate && (
            <p className={styles.birthDate}>{formatFullDate(data.personalInfo.birthDate, data.uiLanguage)}</p>
          )}
        </div>
      </header>

      {data.aiContent?.summary && (
        <Section title={t('sections.summary')}>
          <p className={styles.summaryText}>{data.aiContent.summary}</p>
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

      {data.experience.length > 0 && (
        <Section title={t('sections.experience')}>
          {data.experience.map((exp) => (
            <div key={exp.id} className={`${styles.entry} resume-entry`}>
              <div className={styles.entryHead}>
                <strong>{exp.position}</strong>
                <span className={styles.entryDate}>{formatDateRange(exp.startDate, exp.endDate, data.uiLanguage, present)}</span>
              </div>
              <div className={styles.entrySub}>
                {exp.company}
                {exp.location ? ` · ${exp.location}` : ''}
              </div>
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
                <strong>
                  {edu.degree}
                  {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}
                </strong>
                <span className={styles.entryDate}>{formatDateRange(edu.startDate, edu.endDate, data.uiLanguage, present)}</span>
              </div>
              <div className={styles.entrySub}>{edu.institution}</div>
              {edu.description && <p className={styles.entryDescription}>{edu.description}</p>}
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
