import type { ResumeTemplateProps } from '../../types/resume';
import ContactLinks from './shared/ContactLinks';
import Photo from './shared/Photo';
import { LanguageItems, SkillItems, StrengthItems } from './shared/Blocks';
import { descriptionLines, useTemplateKit, yearOf } from './shared/templateKit';
import styles from './YearScaleTemplate.module.css';

// A ruler of years down the left edge: each job and study is pinned to its
// start year, printed large in the gutter, with the end year small below it.
export default function YearScaleTemplate({ data }: ResumeTemplateProps) {
  const { t, range, birthDate, contactVariant, summary, strengths } = useTemplateKit(data);
  const { fullName, jobTitle } = data.personalInfo;

  const mark = (start: string, end: string | null, current: boolean) => (
    <div className={styles.mark}>
      <span className={styles.year}>{yearOf(start)}</span>
      <span className={styles.until}>{current ? t('present') : `— ${yearOf(end)}`}</span>
    </div>
  );

  return (
    <div className={`${styles.page} resume-document`}>
      <header className={styles.header}>
        <div className={styles.headText}>
          <h1 className={`${styles.name} resume-name`}>{fullName || '—'}</h1>
          {jobTitle && <p className={styles.role}>{jobTitle}</p>}
          <ContactLinks contacts={data.contacts} variant={contactVariant} className={styles.contacts} />
          {birthDate && <p className={styles.meta}>{birthDate}</p>}
        </div>
        <Photo data={data} className={styles.photo} />
      </header>

      {summary && (
        <section className={`${styles.row} resume-section`}>
          <h3 className={styles.label}>{t('sections.summary')}</h3>
          <p className={styles.text}>{summary}</p>
        </section>
      )}

      {strengths.length > 0 && (
        <section className={`${styles.row} resume-section`}>
          <h3 className={styles.label}>{t('sections.strengths')}</h3>
          <StrengthItems data={data} className={styles.strengths} />
        </section>
      )}

      {data.experience.length > 0 && (
        <section className={`${styles.scale} resume-section`}>
          <h3 className={styles.scaleHead}>{t('sections.experience')}</h3>
          {data.experience.map((exp) => (
            <div key={exp.id} className={`${styles.tick} resume-entry`}>
              {mark(exp.startDate, exp.endDate, exp.isCurrent)}
              <div className={styles.body}>
                <div className={styles.title}>{exp.position}</div>
                <div className={styles.sub}>
                  {exp.company}
                  {exp.location ? ` · ${exp.location}` : ''}
                  <span className={styles.range}> · {range(exp.startDate, exp.endDate)}</span>
                </div>
                {descriptionLines(exp.description).length > 0 && (
                  <ul className={styles.bullets}>
                    {descriptionLines(exp.description).map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </section>
      )}

      {data.education.length > 0 && (
        <section className={`${styles.scale} resume-section`}>
          <h3 className={styles.scaleHead}>{t('sections.education')}</h3>
          {data.education.map((edu) => (
            <div key={edu.id} className={`${styles.tick} resume-entry`}>
              {mark(edu.startDate, edu.endDate, edu.endDate === null)}
              <div className={styles.body}>
                <div className={styles.title}>{edu.institution}</div>
                <div className={styles.sub}>
                  {edu.degree}
                  {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}
                </div>
                {edu.description && <p className={styles.textSmall}>{edu.description}</p>}
              </div>
            </div>
          ))}
        </section>
      )}

      {(data.skills.length > 0 || data.languages.length > 0) && (
        <div className={styles.footerGrid}>
          {data.skills.length > 0 && (
            <section className="resume-section">
              <h3 className={styles.label}>{t('sections.skills')}</h3>
              <SkillItems
                data={data}
                cls={{ list: styles.chips, item: styles.chip, level: styles.chipLevel }}
                mark="|"
              />
            </section>
          )}
          {data.languages.length > 0 && (
            <section className="resume-section">
              <h3 className={styles.label}>{t('sections.languages')}</h3>
              <LanguageItems data={data} cls={{ list: styles.chips, item: styles.chip, level: styles.chipLevel }} />
            </section>
          )}
        </div>
      )}
    </div>
  );
}
