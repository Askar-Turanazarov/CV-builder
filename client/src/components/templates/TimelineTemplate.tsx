import { useTranslation } from 'react-i18next';
import type { ResumeTemplateProps } from '../../types/resume';
import { formatDateRange, formatFullDate } from './shared/dateFormat';
import Section from './shared/Section';
import SkillPill from './shared/SkillPill';
import LanguageBadge from './shared/LanguageBadge';
import ContactLinks from './shared/ContactLinks';
import styles from './TimelineTemplate.module.css';

export default function TimelineTemplate({ data }: ResumeTemplateProps) {
  const { t } = useTranslation('templates');
  const present = t('present');

  return (
    <div className={`${styles.page} resume-document`}>
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
          <ContactLinks
            contacts={data.contacts}
            variant={data.viewMode === 'site' ? 'buttons' : 'plain'}
            className={styles.contactList}
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
          <ol className={styles.timeline}>
            {data.experience.map((exp) => (
              <li key={exp.id} className={`${styles.timelineItem} resume-entry`}>
                <div className={styles.timelineDate}>
                  {formatDateRange(exp.startDate, exp.endDate, data.uiLanguage, present)}
                </div>
                <div>
                  <strong>{exp.position}</strong>
                  <div className={styles.timelineSub}>
                    {exp.company}
                    {exp.location ? ` · ${exp.location}` : ''}
                  </div>
                  {exp.description && <p className={styles.timelineDescription}>{exp.description}</p>}
                </div>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {data.education.length > 0 && (
        <Section title={t('sections.education')}>
          <ol className={styles.timeline}>
            {data.education.map((edu) => (
              <li key={edu.id} className={`${styles.timelineItem} resume-entry`}>
                <div className={styles.timelineDate}>
                  {formatDateRange(edu.startDate, edu.endDate, data.uiLanguage, present)}
                </div>
                <div>
                  <strong>
                    {edu.degree}
                    {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}
                  </strong>
                  <div className={styles.timelineSub}>{edu.institution}</div>
                  {edu.description && <p className={styles.timelineDescription}>{edu.description}</p>}
                </div>
              </li>
            ))}
          </ol>
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
