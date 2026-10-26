import type { ResumeTemplateProps } from '../../types/resume';
import type { CSSProperties } from 'react';
import ContactLinks from './shared/ContactLinks';
import LanguageBadge from './shared/LanguageBadge';
import Photo from './shared/Photo';
import { descriptionLines, initials, useTemplateKit } from './shared/templateKit';
import styles from './MetroTemplate.module.css';

// A career drawn as a metro line: jobs are stations (the current one is
// "you are here"), studies run on a second line that the first one
// crosses, skills are the transfer hubs.
export default function MetroTemplate({ data }: ResumeTemplateProps) {
  const { t, range, birthDate, contactVariant, summary, strengths } = useTemplateKit(data);
  const { fullName, jobTitle } = data.personalInfo;
  const lastIndex = data.experience.length - 1;

  return (
    <div className={`${styles.page} resume-document`}>
      <header className={styles.header}>
        <div className={styles.logo} aria-hidden="true">
          M
        </div>
        <div className={styles.headText}>
          <h1 className={`${styles.name} resume-name`}>{fullName || '—'}</h1>
          {jobTitle && (
            <p className={styles.direction}>
              <span className={styles.directionLabel}>{t('metro.direction')}</span> {jobTitle}
            </p>
          )}
          <ContactLinks contacts={data.contacts} variant={contactVariant} className={styles.contacts} />
          {birthDate && <p className={styles.meta}>{birthDate}</p>}
        </div>
        <Photo data={data} className={styles.photo} fallback={initials(fullName)} />
      </header>

      {summary && (
        <section className={`${styles.block} resume-section`}>
          <h3 className={styles.sign}>
            <span className={styles.signDot} data-line="info">i</span>
            {t('sections.summary')}
          </h3>
          <p className={styles.summary}>{summary}</p>
        </section>
      )}

      {strengths.length > 0 && (
        <section className={`${styles.block} resume-section`}>
          <h3 className={styles.sign}>
            <span className={styles.signDot} data-line="info">★</span>
            {t('sections.strengths')}
          </h3>
          <ul className={styles.strengths}>
            {strengths.map((strength, i) => (
              <li key={i}>{strength}</li>
            ))}
          </ul>
        </section>
      )}

      {data.experience.length > 0 && (
        <section className={`${styles.block} resume-section`}>
          <h3 className={styles.sign}>
            <span className={styles.signDot}>1</span>
            {t('sections.experience')}
          </h3>
          <ol className={styles.line}>
            {data.experience.map((exp, i) => (
              <li key={exp.id} className={`${styles.station} resume-entry`} data-first={i === 0} data-last={i === lastIndex}>
                <span className={styles.time}>{range(exp.startDate, exp.endDate)}</span>
                <span className={styles.stop} data-current={exp.isCurrent} aria-hidden="true" />
                <div className={styles.stationBody}>
                  <div className={styles.stationName}>
                    {exp.company}
                    {exp.isCurrent && <span className={styles.here}>{t('metro.youAreHere')}</span>}
                    {!exp.isCurrent && i === lastIndex && <span className={styles.terminus}>{t('metro.terminus')}</span>}
                  </div>
                  <div className={styles.position}>
                    {exp.position}
                    {exp.location ? ` · ${exp.location}` : ''}
                  </div>
                  {descriptionLines(exp.description).map((line, j) => (
                    <p key={j} className={styles.detail}>
                      {line}
                    </p>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {data.education.length > 0 && (
        <section className={`${styles.block} resume-section`}>
          <h3 className={styles.sign}>
            <span className={styles.signDot} data-line="study">2</span>
            {t('sections.education')}
          </h3>
          <ol className={`${styles.line} ${styles.studyLine}`}>
            {data.education.map((edu, i) => (
              <li
                key={edu.id}
                className={`${styles.station} resume-entry`}
                data-first={i === 0}
                data-last={i === data.education.length - 1}
              >
                <span className={styles.time}>{range(edu.startDate, edu.endDate)}</span>
                <span className={styles.stop} data-transfer="true" aria-hidden="true" />
                <div className={styles.stationBody}>
                  <div className={styles.stationName}>{edu.institution}</div>
                  <div className={styles.position}>
                    {edu.degree}
                    {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}
                  </div>
                  {edu.description && <p className={styles.detail}>{edu.description}</p>}
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {(data.skills.length > 0 || data.languages.length > 0) && (
        <section className={`${styles.block} ${styles.legend} resume-section`}>
          <h3 className={styles.sign}>
            <span className={styles.signDot} data-line="hub">⇄</span>
            {t('metro.transfers')}
          </h3>
          <div className={styles.legendGrid}>
            {data.skills.length > 0 && (
              <div>
                <div className={styles.legendTitle}>{t('sections.skills')}</div>
                <ul className={styles.hubs}>
                  {data.skills.map((skill, i) => (
                    <li key={skill.id} className={styles.hub} style={{ '--hub': `var(--metro-${(i % 6) + 1})` } as CSSProperties}>
                      <span className={styles.hubDot} aria-hidden="true" />
                      {skill.name}
                      {skill.level && <span className={styles.hubLevel}>{'●'.repeat(skill.level)}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {data.languages.length > 0 && (
              <div>
                <div className={styles.legendTitle}>{t('sections.languages')}</div>
                <div className={styles.langs}>
                  {data.languages.map((lang) => (
                    <LanguageBadge key={lang.id} language={lang} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
