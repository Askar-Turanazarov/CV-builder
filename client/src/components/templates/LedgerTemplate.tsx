import { useTranslation } from 'react-i18next';
import type { ResumeTemplateProps } from '../../types/resume';
import { formatDateRange, formatFullDate } from './shared/dateFormat';
import Section from './shared/Section';
import SkillPill from './shared/SkillPill';
import LanguageBadge from './shared/LanguageBadge';
import ContactLinks from './shared/ContactLinks';
import styles from './LedgerTemplate.module.css';

// Experience and education render as literal ledger/spreadsheet rows
// (Period | Position/Degree | Company/Institution | Description) instead of
// prose paragraphs — clean, ATS-safe, but visually a bookkeeping register.
export default function LedgerTemplate({ data }: ResumeTemplateProps) {
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
        <div>
          <h1 className={`${styles.name} resume-name`}>{data.personalInfo.fullName || '—'}</h1>
          <p className={styles.jobTitle}>{data.personalInfo.jobTitle}</p>
          <div className={styles.contactRow}>
            <ContactLinks contacts={data.contacts} variant={data.viewMode === 'site' ? 'buttons' : 'plain'} />
            {data.personalInfo.birthDate && (
              <span className={styles.birthDate}>{formatFullDate(data.personalInfo.birthDate, data.uiLanguage)}</span>
            )}
          </div>
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
          <div className={styles.table} role="table">
            <div className={`${styles.row} ${styles.headRow}`} role="row">
              <span className={styles.colPeriod}>{t('ledger.period', { defaultValue: 'Period' })}</span>
              <span className={styles.colPosition}>{t('ledger.position', { defaultValue: 'Position' })}</span>
              <span className={styles.colCompany}>{t('ledger.company', { defaultValue: 'Company' })}</span>
              <span className={styles.colDescription}>{t('ledger.details', { defaultValue: 'Details' })}</span>
            </div>
            {data.experience.map((exp) => (
              <div key={exp.id} className={`${styles.row} resume-entry`} role="row">
                <span className={styles.colPeriod}>{formatDateRange(exp.startDate, exp.endDate, data.uiLanguage, present)}</span>
                <span className={styles.colPosition}>
                  <strong>{exp.position}</strong>
                </span>
                <span className={styles.colCompany}>
                  {exp.company}
                  {exp.location ? ` · ${exp.location}` : ''}
                </span>
                <span className={styles.colDescription}>{exp.description}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {data.education.length > 0 && (
        <Section title={t('sections.education')}>
          <div className={styles.table} role="table">
            <div className={`${styles.row} ${styles.headRow}`} role="row">
              <span className={styles.colPeriod}>{t('ledger.period', { defaultValue: 'Period' })}</span>
              <span className={styles.colPosition}>{t('ledger.degree', { defaultValue: 'Degree' })}</span>
              <span className={styles.colCompany}>{t('ledger.institution', { defaultValue: 'Institution' })}</span>
              <span className={styles.colDescription}>{t('ledger.details', { defaultValue: 'Details' })}</span>
            </div>
            {data.education.map((edu) => (
              <div key={edu.id} className={`${styles.row} resume-entry`} role="row">
                <span className={styles.colPeriod}>{formatDateRange(edu.startDate, edu.endDate, data.uiLanguage, present)}</span>
                <span className={styles.colPosition}>
                  <strong>
                    {edu.degree}
                    {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}
                  </strong>
                </span>
                <span className={styles.colCompany}>{edu.institution}</span>
                <span className={styles.colDescription}>{edu.description}</span>
              </div>
            ))}
          </div>
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
