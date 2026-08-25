import { useTranslation } from 'react-i18next';
import type { ResumeTemplateProps } from '../../types/resume';
import { formatDateRange, formatFullDate } from './shared/dateFormat';
import Section from './shared/Section';
import SkillPill from './shared/SkillPill';
import LanguageBadge from './shared/LanguageBadge';
import ContactLinks from './shared/ContactLinks';
import styles from './RadialTimelineTemplate.module.css';

// Experience entries fan out around a central photo "hub" instead of a
// straight vertical list. To stay reliable for anywhere from 2 to 8+
// entries, this uses a fan/hub layout: a circular hub at the top with a
// horizontal spine below it, and entry "spokes" alternating up/down along
// a responsive grid — evoking a radial burst without fragile trigonometry
// that would break down (overlapping cards) for uneven entry counts.
export default function RadialTimelineTemplate({ data }: ResumeTemplateProps) {
  const { t } = useTranslation('templates');
  const present = t('present');

  return (
    <div className={`${styles.page} resume-document ${data.viewMode === 'site' ? styles.site : styles.document}`}>
      <header className={styles.hub}>
        <div className={`${styles.photoWrap} resume-photo`}>
          {data.personalInfo.photo ? (
            <img src={data.personalInfo.photo} alt={data.personalInfo.fullName} />
          ) : (
            <span className={styles.photoPlaceholder}>{t('noPhoto')}</span>
          )}
        </div>
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
        <Section title={t('sections.experience')} className={styles.radialSection}>
          <div className={styles.spine} aria-hidden="true" />
          <div className={styles.ring}>
            {data.experience.map((exp, index) => (
              <div
                key={exp.id}
                className={`${styles.node} ${index % 2 === 0 ? styles.nodeUp : styles.nodeDown} resume-entry`}
              >
                <div className={styles.nodeDot} aria-hidden="true" />
                <div className={styles.nodeCard}>
                  <div className={styles.entryHead}>
                    <strong>{exp.position}</strong>
                    <span className={styles.entryDate}>
                      {formatDateRange(exp.startDate, exp.endDate, data.uiLanguage, present)}
                    </span>
                  </div>
                  <div className={styles.entrySub}>
                    {exp.company}
                    {exp.location ? ` · ${exp.location}` : ''}
                  </div>
                  {exp.description && <p className={styles.entryDescription}>{exp.description}</p>}
                </div>
              </div>
            ))}
          </div>
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
