import { useTranslation } from 'react-i18next';
import type { ResumeTemplateProps } from '../../types/resume';
import { formatDateRange, formatFullDate } from './shared/dateFormat';
import SkillPill from './shared/SkillPill';
import LanguageBadge from './shared/LanguageBadge';
import ContactLinks from './shared/ContactLinks';
import styles from './PosterTemplate.module.css';

// Concert-poster energy: the name is rendered huge and asymmetric, one
// bold accent-filled block anchors the layout, everything else is quiet
// by comparison. A deliberately loud, unconventional resume.
export default function PosterTemplate({ data }: ResumeTemplateProps) {
  const { t } = useTranslation('templates');
  const present = t('present');

  return (
    <div className={`${styles.page} resume-document`}>
      <div className={styles.fill} />
      <header className={styles.header}>
        <h1 className={`${styles.name} resume-name`}>{data.personalInfo.fullName || '—'}</h1>
        <p className={styles.jobTitle}>{data.personalInfo.jobTitle}</p>
      </header>

      <div className={styles.contactRow}>
        <ContactLinks contacts={data.contacts} variant={data.viewMode === 'site' ? 'buttons' : 'plain'} />
        {data.personalInfo.birthDate && (
          <span className={styles.birthDate}>{formatFullDate(data.personalInfo.birthDate, data.uiLanguage)}</span>
        )}
      </div>

      <div className={styles.content}>
        {data.aiContent?.summary && (
          <section className={`${styles.block} resume-section`}>
            <h3>{t('sections.summary')}</h3>
            <p>{data.aiContent.summary}</p>
          </section>
        )}

        {data.aiContent && data.aiContent.strengths.length > 0 && (
          <section className={`${styles.block} resume-section`}>
            <h3>{t('sections.strengths')}</h3>
            <p className={styles.bigList}>{data.aiContent.strengths.join('  ★  ')}</p>
          </section>
        )}

        {data.experience.length > 0 && (
          <section className={`${styles.block} resume-section`}>
            <h3>{t('sections.experience')}</h3>
            {data.experience.map((exp) => (
              <div key={exp.id} className={`${styles.entry} resume-entry`}>
                <span className={styles.entryTitle}>
                  {exp.position} — {exp.company}
                </span>
                <span className={styles.entryDate}>{formatDateRange(exp.startDate, exp.endDate, data.uiLanguage, present)}</span>
              </div>
            ))}
          </section>
        )}

        {data.education.length > 0 && (
          <section className={`${styles.block} resume-section`}>
            <h3>{t('sections.education')}</h3>
            {data.education.map((edu) => (
              <div key={edu.id} className={`${styles.entry} resume-entry`}>
                <span className={styles.entryTitle}>
                  {edu.degree}
                  {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''} — {edu.institution}
                </span>
                <span className={styles.entryDate}>{formatDateRange(edu.startDate, edu.endDate, data.uiLanguage, present)}</span>
              </div>
            ))}
          </section>
        )}

        {data.skills.length > 0 && (
          <section className={`${styles.block} resume-section`}>
            <h3>{t('sections.skills')}</h3>
            <div className={styles.pillRow}>
              {data.skills.map((skill) => (
                <SkillPill key={skill.id} skill={skill} />
              ))}
            </div>
          </section>
        )}

        {data.languages.length > 0 && (
          <section className={`${styles.block} resume-section`}>
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
