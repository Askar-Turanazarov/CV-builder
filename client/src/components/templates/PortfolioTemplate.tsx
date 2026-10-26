import type { ResumeTemplateProps } from '../../types/resume';
import ContactLinks from './shared/ContactLinks';
import Photo from './shared/Photo';
import { EducationEntries, LanguageItems, StrengthItems } from './shared/Blocks';
import { descriptionLines, initials, useTemplateKit } from './shared/templateKit';
import styles from './PortfolioTemplate.module.css';

// A personal site on paper: a greeting header, jobs as numbered project
// cards in a two-column grid, and skills as a tag cloud sized by level.
export default function PortfolioTemplate({ data }: ResumeTemplateProps) {
  const { t, range, birthDate, contactVariant, summary, strengths } = useTemplateKit(data);
  const { fullName, jobTitle } = data.personalInfo;

  return (
    <div className={`${styles.page} resume-document`}>
      <header className={styles.header}>
        <div className={styles.hello}>
          <p className={styles.greeting}>{t('portfolio.hello')}</p>
          <h1 className={`${styles.name} resume-name`}>{fullName || '—'}</h1>
          {jobTitle && <p className={styles.role}>{jobTitle}</p>}
          <ContactLinks contacts={data.contacts} variant={contactVariant} className={styles.contacts} />
          {birthDate && <p className={styles.meta}>{birthDate}</p>}
        </div>
        <Photo data={data} className={styles.photo} fallback={initials(fullName)} />
      </header>

      {summary && (
        <section className={`${styles.block} resume-section`}>
          <h3 className={styles.heading}>{t('sections.summary')}</h3>
          <p className={styles.summary}>{summary}</p>
        </section>
      )}

      {data.experience.length > 0 && (
        <section className={`${styles.block} resume-section`}>
          <h3 className={styles.heading}>{t('portfolio.work')}</h3>
          <div className={styles.cards}>
            {data.experience.map((exp, i) => {
              const lines = descriptionLines(exp.description);
              return (
                <article key={exp.id} className={`${styles.card} resume-entry`}>
                  <span className={styles.number}>{String(i + 1).padStart(2, '0')}</span>
                  <h4 className={styles.cardTitle}>{exp.position}</h4>
                  <p className={styles.cardSub}>
                    {exp.company}
                    {exp.location ? ` · ${exp.location}` : ''}
                  </p>
                  <p className={styles.cardDate}>{range(exp.startDate, exp.endDate)}</p>
                  {lines.length > 0 && (
                    <ul className={styles.cardList}>
                      {lines.map((line, j) => (
                        <li key={j}>{line}</li>
                      ))}
                    </ul>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}

      <div className={styles.split}>
        {data.skills.length > 0 && (
          <section className={`${styles.block} resume-section`}>
            <h3 className={styles.heading}>{t('sections.skills')}</h3>
            <ul className={styles.tags}>
              {data.skills.map((skill) => (
                <li key={skill.id} className={`${styles.tag} skill-pill`} data-level={skill.level ?? 3}>
                  {skill.name}
                </li>
              ))}
            </ul>
          </section>
        )}
        {strengths.length > 0 && (
          <section className={`${styles.block} resume-section`}>
            <h3 className={styles.heading}>{t('sections.strengths')}</h3>
            <StrengthItems data={data} className={styles.strengths} />
          </section>
        )}
      </div>

      <div className={styles.split}>
        {data.education.length > 0 && (
          <section className={`${styles.block} resume-section`}>
            <h3 className={styles.heading}>{t('sections.education')}</h3>
            <EducationEntries
              data={data}
              cls={{
                entry: styles.edu,
                head: styles.eduHead,
                title: styles.eduTitle,
                date: styles.cardDate,
                sub: styles.cardSub,
                text: styles.eduText,
              }}
            />
          </section>
        )}
        {data.languages.length > 0 && (
          <section className={`${styles.block} resume-section`}>
            <h3 className={styles.heading}>{t('sections.languages')}</h3>
            <LanguageItems data={data} cls={{ list: styles.langs, item: styles.lang, level: styles.langLevel }} />
          </section>
        )}
      </div>
    </div>
  );
}
