import { useTranslation } from 'react-i18next';
import type { ResumeTemplateProps } from '../../types/resume';
import { formatDateRange, formatFullDate } from './shared/dateFormat';
import SkillPill from './shared/SkillPill';
import LanguageBadge from './shared/LanguageBadge';
import ContactLinks from './shared/ContactLinks';
import styles from './EditorialTemplate.module.css';

// Newspaper/magazine layout: a masthead-style header, the summary set in
// justified newspaper columns with a drop-cap opening letter.
export default function EditorialTemplate({ data }: ResumeTemplateProps) {
  const { t } = useTranslation('templates');
  const present = t('present');

  return (
    <div className={`${styles.page} resume-document`}>
      <div className={styles.masthead}>{t('sections.summary')}</div>
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

      {data.aiContent?.summary && (
        <p className={styles.dropCapText}>{data.aiContent.summary}</p>
      )}

      {data.aiContent && data.aiContent.strengths.length > 0 && (
        <section className={`${styles.columnSection} resume-section`}>
          <h3>{t('sections.strengths')}</h3>
          <ul className={styles.strengthList}>
            {data.aiContent.strengths.map((strength, index) => (
              <li key={index}>{strength}</li>
            ))}
          </ul>
        </section>
      )}

      {data.experience.length > 0 && (
        <section className={`${styles.columnSection} resume-section`}>
          <h3>{t('sections.experience')}</h3>
          {data.experience.map((exp) => (
            <p key={exp.id} className="resume-entry">
              <strong>{exp.position}</strong>, {exp.company} ({formatDateRange(exp.startDate, exp.endDate, data.uiLanguage, present)}).{' '}
              {exp.description}
            </p>
          ))}
        </section>
      )}

      {data.education.length > 0 && (
        <section className={`${styles.columnSection} resume-section`}>
          <h3>{t('sections.education')}</h3>
          {data.education.map((edu) => (
            <p key={edu.id} className="resume-entry">
              <strong>
                {edu.degree}
                {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}
              </strong>
              , {edu.institution} ({formatDateRange(edu.startDate, edu.endDate, data.uiLanguage, present)}).
            </p>
          ))}
        </section>
      )}

      {data.skills.length > 0 && (
        <section className={`${styles.wideSection} resume-section`}>
          <h3>{t('sections.skills')}</h3>
          <div className={styles.pillRow}>
            {data.skills.map((skill) => (
              <SkillPill key={skill.id} skill={skill} />
            ))}
          </div>
        </section>
      )}

      {data.languages.length > 0 && (
        <section className={`${styles.wideSection} resume-section`}>
          <h3>{t('sections.languages')}</h3>
          <div className={styles.pillRow}>
            {data.languages.map((lang) => (
              <LanguageBadge key={lang.id} language={lang} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
