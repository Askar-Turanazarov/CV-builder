import { useTranslation } from 'react-i18next';
import type { ResumeTemplateProps } from '../../types/resume';
import { formatDateRange, formatFullDate } from './shared/dateFormat';
import Section from './shared/Section';
import SkillPill from './shared/SkillPill';
import LanguageBadge from './shared/LanguageBadge';
import ContactLinks from './shared/ContactLinks';
import styles from './HybridTemplate.module.css';

// Combination format: a compact skills/summary band up top, then a full
// reverse-chronological experience section with real descriptions below —
// the middle ground between Functional and Classic.
export default function HybridTemplate({ data }: ResumeTemplateProps) {
  const { t } = useTranslation('templates');
  const present = t('present');

  return (
    <div className={`${styles.page} resume-document`}>
      <header className={styles.header}>
        <div>
          <h1 className={`${styles.name} resume-name`}>{data.personalInfo.fullName || '—'}</h1>
          <p className={styles.jobTitle}>{data.personalInfo.jobTitle}</p>
        </div>
        <div className={styles.contactCol}>
          <ContactLinks
            contacts={data.contacts}
            variant={data.viewMode === 'site' ? 'buttons' : 'plain'}
            className={styles.contactRow}
          />
          {data.personalInfo.birthDate && (
            <span className={styles.birthDate}>{formatFullDate(data.personalInfo.birthDate, data.uiLanguage)}</span>
          )}
        </div>
      </header>

      {(data.aiContent?.summary || data.skills.length > 0) && (
        <div className={styles.band}>
          {data.aiContent?.summary && <p className={styles.summaryText}>{data.aiContent.summary}</p>}
          {data.skills.length > 0 && (
            <div className={styles.skillsLine}>
              <strong>{t('sections.skills')}:</strong>
              <div className={styles.pillRow}>
                {data.skills.map((skill) => (
                  <SkillPill key={skill.id} skill={skill} />
                ))}
              </div>
            </div>
          )}
        </div>
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
              <div className={styles.entrySub}>{exp.company}</div>
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
            </div>
          ))}
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
