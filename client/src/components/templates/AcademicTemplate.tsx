import { useTranslation } from 'react-i18next';
import type { ResumeTemplateProps } from '../../types/resume';
import { formatDateRange, formatFullDate } from './shared/dateFormat';
import Section from './shared/Section';
import SkillPill from './shared/SkillPill';
import LanguageBadge from './shared/LanguageBadge';
import ContactLinks from './shared/ContactLinks';
import styles from './AcademicTemplate.module.css';

// Academic CV convention: education leads (degrees matter most), long-form
// single column, minimal color, serif throughout.
export default function AcademicTemplate({ data }: ResumeTemplateProps) {
  const { t } = useTranslation('templates');
  const present = t('present');

  return (
    <div className={`${styles.page} resume-document`}>
      <header className={styles.header}>
        <h1 className={`${styles.name} resume-name`}>{data.personalInfo.fullName || '—'}</h1>
        <p className={styles.jobTitle}>{data.personalInfo.jobTitle}</p>
        <div className={styles.contactLine}>
          <ContactLinks contacts={data.contacts} variant={data.viewMode === 'site' ? 'buttons' : 'plain'} />
          {data.personalInfo.birthDate && (
            <span className={styles.birthDate}>{formatFullDate(data.personalInfo.birthDate, data.uiLanguage)}</span>
          )}
        </div>
      </header>

      {data.education.length > 0 && (
        <Section title={t('sections.education')}>
          {/* Compact table-like layout: three logical columns per row —
              Degree | Institution | Years — instead of stacked paragraphs. */}
          <div className={styles.eduTable}>
            {data.education.map((edu) => (
              <div key={edu.id} className={`${styles.eduRow} resume-entry`}>
                <div className={styles.eduDegree}>
                  <strong>{edu.degree}</strong>
                  {edu.fieldOfStudy && <span className={styles.eduField}>, {edu.fieldOfStudy}</span>}
                </div>
                <div className={styles.eduInstitution}>{edu.institution}</div>
                <div className={styles.eduYears}>{formatDateRange(edu.startDate, edu.endDate, data.uiLanguage, present)}</div>
                {edu.description && <p className={styles.eduDescription}>{edu.description}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}

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
                <strong>{exp.position}</strong>
                <span className={styles.entryDate}>{formatDateRange(exp.startDate, exp.endDate, data.uiLanguage, present)}</span>
              </div>
              <div className={styles.entrySub}>{exp.company}</div>
              {exp.description && <p className={styles.entryDescription}>{exp.description}</p>}
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
    </div>
  );
}
