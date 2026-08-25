import { useTranslation } from 'react-i18next';
import type { ResumeTemplateProps } from '../../types/resume';
import { formatDateRange, formatFullDate } from './shared/dateFormat';
import SkillPill from './shared/SkillPill';
import LanguageBadge from './shared/LanguageBadge';
import ContactLinks from './shared/ContactLinks';
import styles from './UltraCardTemplate.module.css';

// A resume that looks like a giant business card floating in empty space —
// deliberately minimal content density, centered, icon-first contacts.
// Not for long resumes; a statement piece for short, punchy ones.
export default function UltraCardTemplate({ data }: ResumeTemplateProps) {
  const { t } = useTranslation('templates');
  const present = t('present');

  return (
    <div className={`${styles.page} resume-document`}>
      <div className={styles.card}>
        <h1 className={`${styles.name} resume-name`}>{data.personalInfo.fullName || '—'}</h1>
        <div className={styles.divider} />
        <p className={styles.jobTitle}>{data.personalInfo.jobTitle}</p>

        <div className={styles.contactGrid}>
          <ContactLinks contacts={data.contacts} variant={data.viewMode === 'site' ? 'buttons' : 'plain'} />
          {data.personalInfo.birthDate && (
            <span className={styles.birthDate}>
              <span aria-hidden="true">✦</span> {formatFullDate(data.personalInfo.birthDate, data.uiLanguage)}
            </span>
          )}
        </div>

        {data.aiContent?.summary && <p className={styles.summaryText}>{data.aiContent.summary}</p>}

        {data.skills.length > 0 && (
          <div className={styles.pillRow}>
            {data.skills.map((skill) => (
              <SkillPill key={skill.id} skill={skill} />
            ))}
          </div>
        )}
      </div>

      <div className={styles.detailsCard}>
        {data.experience.length > 0 && (
          <section className="resume-section">
            <h3>{t('sections.experience')}</h3>
            {data.experience.map((exp) => (
              <div key={exp.id} className="resume-entry">
                <strong>{exp.position}</strong> — {exp.company} (
                {formatDateRange(exp.startDate, exp.endDate, data.uiLanguage, present)})
              </div>
            ))}
          </section>
        )}

        {data.education.length > 0 && (
          <section className="resume-section">
            <h3>{t('sections.education')}</h3>
            {data.education.map((edu) => (
              <div key={edu.id} className="resume-entry">
                {edu.degree}
                {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''} — {edu.institution}
              </div>
            ))}
          </section>
        )}

        {data.languages.length > 0 && (
          <section className="resume-section">
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
