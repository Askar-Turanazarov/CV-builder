import { useTranslation } from 'react-i18next';
import type { ResumeTemplateProps } from '../../types/resume';
import { formatDateRange, formatFullDate } from './shared/dateFormat';
import Section from './shared/Section';
import SkillPill from './shared/SkillPill';
import LanguageBadge from './shared/LanguageBadge';
import ContactLinks from './shared/ContactLinks';
import styles from './FunctionalTemplate.module.css';

// Skills-first / functional format: good for career changers. Skills get
// the largest, most prominent block; experience is condensed to short
// one-line entries rather than long narrative descriptions.
export default function FunctionalTemplate({ data }: ResumeTemplateProps) {
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

      {data.aiContent?.summary && (
        <Section title={t('sections.summary')}>
          <p className={styles.summaryText}>{data.aiContent.summary}</p>
        </Section>
      )}

      {data.skills.length > 0 && (
        <section className={`${styles.skillsSection} resume-section`}>
          <h3>{t('sections.skills')}</h3>
          {/* Skills-first concept made literal: each skill gets its own
              proficiency bar, filled to skill.level (1-5) as a percentage,
              alongside the pill label. */}
          <div className={styles.skillsGrid}>
            {data.skills.map((skill) => (
              <div key={skill.id} className={styles.skillBarItem}>
                <SkillPill skill={skill} />
                <div className={styles.skillBarTrack}>
                  <div className={styles.skillBarFill} style={{ width: `${(skill.level ?? 3) * 20}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
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
              <span>
                <strong>{exp.position}</strong> · {exp.company}
              </span>
              <span className={styles.entryDate}>{formatDateRange(exp.startDate, exp.endDate, data.uiLanguage, present)}</span>
            </div>
          ))}
        </Section>
      )}

      {data.education.length > 0 && (
        <Section title={t('sections.education')}>
          {data.education.map((edu) => (
            <div key={edu.id} className={`${styles.entry} resume-entry`}>
              <span>
                <strong>
                  {edu.degree}
                  {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}
                </strong>{' '}
                · {edu.institution}
              </span>
              <span className={styles.entryDate}>{formatDateRange(edu.startDate, edu.endDate, data.uiLanguage, present)}</span>
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
