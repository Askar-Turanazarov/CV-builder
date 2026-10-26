import { useTranslation } from 'react-i18next';
import type { ResumeTemplateProps } from '../../types/resume';
import { formatDateRange, formatFullDate } from './shared/dateFormat';
import Section from './shared/Section';
import LanguageBadge from './shared/LanguageBadge';
import ContactLinks from './shared/ContactLinks';
import { descriptionLines } from './shared/templateKit';
import styles from './DashboardStatsTemplate.module.css';

// Reframes the resume as an analytics/KPI dashboard: big stat tiles up top,
// skills rendered as horizontal progress bars instead of pills, jobs as
// full-width cards and education as a card grid. Deliberately reads like a
// metrics panel rather than a document.
function parseYearMonth(value: string): number | null {
  const [year, month] = value.split('-').map(Number);
  if (!year || !month) return null;
  return year * 12 + (month - 1);
}

function estimateYearsOfExperience(experience: ResumeTemplateProps['data']['experience']): number {
  let earliest: number | null = null;
  let latest: number | null = null;
  const now = new Date();
  const nowIndex = now.getFullYear() * 12 + now.getMonth();

  for (const exp of experience) {
    const start = parseYearMonth(exp.startDate);
    if (start !== null && (earliest === null || start < earliest)) earliest = start;

    const end = exp.isCurrent || !exp.endDate ? nowIndex : parseYearMonth(exp.endDate);
    if (end !== null && (latest === null || end > latest)) latest = end;
  }

  if (earliest === null || latest === null || latest <= earliest) return 0;
  return Math.max(1, Math.round((latest - earliest) / 12));
}

export default function DashboardStatsTemplate({ data }: ResumeTemplateProps) {
  const { t } = useTranslation('templates');
  const present = t('present');

  const years = estimateYearsOfExperience(data.experience);
  const stats = [
    { value: years, label: t('deck.years', { count: years }) },
    { value: data.experience.length, label: t('deck.companies', { count: data.experience.length }) },
    { value: data.skills.length, label: t('deck.skills', { count: data.skills.length }) },
    { value: data.languages.length, label: t('deck.languages', { count: data.languages.length }) },
  ];

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
        <div className={styles.headerText}>
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
        </div>
      </header>

      <div className={styles.statGrid}>
        {stats.map((stat) => (
          <div key={stat.label} className={styles.statTile}>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>

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

      {data.skills.length > 0 && (
        <Section title={t('sections.skills')}>
          <div className={styles.barList}>
            {data.skills.map((skill) => (
              <div key={skill.id} className={styles.barRow}>
                <span className={styles.barLabel}>{skill.name}</span>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ width: `${(skill.level ?? 3) * 20}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {data.experience.length > 0 && (
        <Section title={t('sections.experience')}>
          <div className={styles.cardList}>
            {data.experience.map((exp) => (
              <div key={exp.id} className={`${styles.card} ${styles.jobCard}`}>
                <div className={styles.cardHead}>
                  <strong>{exp.position}</strong>
                  <span className={styles.cardDate}>
                    {formatDateRange(exp.startDate, exp.endDate, data.uiLanguage, present)}
                  </span>
                </div>
                <div className={styles.cardSub}>
                  {exp.company}
                  {exp.location ? ` · ${exp.location}` : ''}
                </div>
                {descriptionLines(exp.description).map((line, i) => (
                  <p key={i} className={styles.cardLine}>
                    {line}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </Section>
      )}

      {data.education.length > 0 && (
        <Section title={t('sections.education')}>
          <div className={styles.cardGrid}>
            {data.education.map((edu) => (
              <div key={edu.id} className={`${styles.card} resume-entry`}>
                <div className={styles.cardHead}>
                  <strong>
                    {edu.degree}
                    {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}
                  </strong>
                  <span className={styles.cardDate}>
                    {formatDateRange(edu.startDate, edu.endDate, data.uiLanguage, present)}
                  </span>
                </div>
                <div className={styles.cardSub}>{edu.institution}</div>
                {edu.description && <p className={styles.cardDescription}>{edu.description}</p>}
              </div>
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
