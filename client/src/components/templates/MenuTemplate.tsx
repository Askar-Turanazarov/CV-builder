import type { ResumeTemplateProps } from '../../types/resume';
import ContactLinks from './shared/ContactLinks';
import { descriptionLines, useTemplateKit, yearOf } from './shared/templateKit';
import styles from './MenuTemplate.module.css';

/** Whole years between two yyyy-mm values (open end = now), at least 1 */
function yearsBetween(start: string, end: string | null): number {
  const from = Number(yearOf(start));
  const to = Number(yearOf(end));
  return Math.max(1, to - from);
}

// The resume as a restaurant menu: the summary is the chef's special,
// strengths are starters, jobs are main courses with dotted leaders and the
// years in place of a price, studies are desserts, skills are spices,
// languages are drinks, contacts are the reservation line.
export default function MenuTemplate({ data }: ResumeTemplateProps) {
  const { t, range, birthDate, contactVariant, summary, strengths } = useTemplateKit(data);
  const { fullName, jobTitle } = data.personalInfo;

  return (
    <div className={`${styles.page} resume-document`}>
      <header className={styles.header}>
        <div className={styles.ornament} aria-hidden="true">
          ❦
        </div>
        <div className={styles.house}>{t('menu.house')}</div>
        <h1 className={`${styles.name} resume-name`}>{fullName || '—'}</h1>
        {jobTitle && <p className={styles.cuisine}>{jobTitle}</p>}
        {birthDate && <p className={styles.since}>{t('menu.since', { date: birthDate })}</p>}
      </header>

      {summary && (
        <section className={`${styles.special} resume-section`}>
          <h3 className={styles.course}>{t('menu.special')}</h3>
          <p className={styles.specialText}>{summary}</p>
        </section>
      )}

      {strengths.length > 0 && (
        <section className={`${styles.block} resume-section`}>
          <h3 className={styles.course}>{t('menu.starters')}</h3>
          <ul className={styles.starters}>
            {strengths.map((strength, i) => (
              <li key={i}>{strength}</li>
            ))}
          </ul>
        </section>
      )}

      {data.experience.length > 0 && (
        <section className={`${styles.block} resume-section`}>
          <h3 className={styles.course}>{t('menu.mains')}</h3>
          {data.experience.map((exp) => (
            <div key={exp.id} className={`${styles.dish} resume-entry`}>
              <div className={styles.dishLine}>
                <span className={styles.dishName}>{exp.position}</span>
                <span className={styles.leader} aria-hidden="true" />
                <span className={styles.price}>
                  {t('menu.years', { count: yearsBetween(exp.startDate, exp.endDate) })}
                </span>
              </div>
              <div className={styles.dishFrom}>
                {exp.company} · {range(exp.startDate, exp.endDate)}
                {exp.location ? ` · ${exp.location}` : ''}
                {exp.isCurrent && <span className={styles.fresh}>{t('menu.fresh')}</span>}
              </div>
              {descriptionLines(exp.description).length > 0 && (
                <p className={styles.ingredients}>{descriptionLines(exp.description).join(' · ')}</p>
              )}
            </div>
          ))}
        </section>
      )}

      {data.education.length > 0 && (
        <section className={`${styles.block} resume-section`}>
          <h3 className={styles.course}>{t('menu.desserts')}</h3>
          {data.education.map((edu) => (
            <div key={edu.id} className={`${styles.dish} resume-entry`}>
              <div className={styles.dishLine}>
                <span className={styles.dishName}>{edu.institution}</span>
                <span className={styles.leader} aria-hidden="true" />
                <span className={styles.price}>{yearOf(edu.endDate)}</span>
              </div>
              <div className={styles.dishFrom}>
                {edu.degree}
                {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''} · {range(edu.startDate, edu.endDate)}
              </div>
              {edu.description && <p className={styles.ingredients}>{edu.description}</p>}
            </div>
          ))}
        </section>
      )}

      <div className={styles.pair}>
        {data.skills.length > 0 && (
          <section className={`${styles.block} resume-section`}>
            <h3 className={styles.course}>{t('menu.spices')}</h3>
            <ul className={styles.spices}>
              {data.skills.map((skill) => (
                <li key={skill.id}>
                  <span>{skill.name}</span>
                  {skill.level && (
                    <span className={styles.heat} aria-label={`${skill.level}/5`}>
                      {'🌶'.repeat(Math.ceil(skill.level / 2))}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {data.languages.length > 0 && (
          <section className={`${styles.block} resume-section`}>
            <h3 className={styles.course}>{t('menu.drinks')}</h3>
            <ul className={styles.spices}>
              {data.languages.map((lang) => (
                <li key={lang.id}>
                  <span>{lang.name}</span>
                  <span className={styles.leader} aria-hidden="true" />
                  <span className={styles.price}>{lang.level === 'native' ? t('nativeLanguage') : lang.level}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <footer className={`${styles.reservation} resume-entry`}>
        <div className={styles.reserveTitle}>{t('menu.reservations')}</div>
        <ContactLinks contacts={data.contacts} variant={contactVariant} className={styles.contacts} />
      </footer>
    </div>
  );
}
