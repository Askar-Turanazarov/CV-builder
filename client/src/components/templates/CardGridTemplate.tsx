import { useTranslation } from 'react-i18next';
import type { ResumeTemplateProps } from '../../types/resume';
import { formatDateRange, formatFullDate } from './shared/dateFormat';
import SkillPill from './shared/SkillPill';
import LanguageBadge from './shared/LanguageBadge';
import ContactLinks from './shared/ContactLinks';
import styles from './CardGridTemplate.module.css';

// A dashboard-like layout: every section is its own floating card inside a
// responsive auto-fit grid, instead of one flowing column of sections.
export default function CardGridTemplate({ data }: ResumeTemplateProps) {
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

      <div className={styles.grid}>
        {data.aiContent?.summary && (
          <section className={`${styles.card} resume-section`}>
            <h3>{t('sections.summary')}</h3>
            <p className={styles.summaryText}>{data.aiContent.summary}</p>
          </section>
        )}

        {data.aiContent && data.aiContent.strengths.length > 0 && (
          <section className={`${styles.card} resume-section`}>
            <h3>{t('sections.strengths')}</h3>
            <ul className={styles.strengthList}>
              {data.aiContent.strengths.map((strength, index) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
          </section>
        )}

        {data.experience.length > 0 && (
          <section className={`${styles.card} ${styles.wideCard} resume-section`}>
            <h3>{t('sections.experience')}</h3>
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
          </section>
        )}

        {data.education.length > 0 && (
          <section className={`${styles.card} resume-section`}>
            <h3>{t('sections.education')}</h3>
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
          </section>
        )}

        {data.skills.length > 0 && (
          <section className={`${styles.card} resume-section`}>
            <h3>{t('sections.skills')}</h3>
            <div className={styles.pillRow}>
              {data.skills.map((skill) => (
                <SkillPill key={skill.id} skill={skill} />
              ))}
            </div>
          </section>
        )}

        {data.languages.length > 0 && (
          <section className={`${styles.card} resume-section`}>
            <h3>{t('sections.languages')}</h3>
            <div className={styles.pillRow}>
              {data.languages.map((lang) => (
                <LanguageBadge key={lang.id} language={lang} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
