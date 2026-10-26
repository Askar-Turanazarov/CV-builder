import type { ResumeTemplateProps } from '../../types/resume';
import ContactLinks from './shared/ContactLinks';
import LanguageBadge from './shared/LanguageBadge';
import Photo from './shared/Photo';
import { formatFullDate } from './shared/dateFormat';
import { descriptionLines, useTemplateKit } from './shared/templateKit';
import styles from './NewspaperTemplate.module.css';

function dayOfYear(date: Date): number {
  return Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) / 86_400_000) + 1;
}

// The resume as the front page of a newspaper: masthead and date line, the
// name as the headline, the summary as the lead story with a drop cap, jobs
// as news items (the current one is "breaking"), skills as a market summary.
export default function NewspaperTemplate({ data }: ResumeTemplateProps) {
  const { t, range, birthDate, contactVariant, summary, strengths } = useTemplateKit(data);
  const { fullName, jobTitle } = data.personalInfo;
  const today = new Date();
  const issueDate = formatFullDate(today.toISOString().slice(0, 10), data.uiLanguage);
  const [lead, ...items] = data.experience;

  return (
    <div className={`${styles.page} resume-document`}>
      <header className={styles.masthead}>
        <div className={styles.dateLine}>
          <span>{t('newspaper.issue', { n: dayOfYear(today) })}</span>
          <span>{issueDate}</span>
          <span>{data.contacts.location || t('newspaper.edition')}</span>
        </div>
        <div className={styles.title}>{t('newspaper.title')}</div>
        <div className={styles.tagline}>{t('newspaper.tagline')}</div>
      </header>

      <section className={styles.front}>
        <h1 className={`${styles.headline} resume-name`}>{fullName || '—'}</h1>
        {jobTitle && <p className={styles.deck}>{jobTitle}</p>}
        <div className={styles.byline}>
          <ContactLinks contacts={data.contacts} variant={contactVariant} className={styles.contacts} />
          {birthDate && <span className={styles.born}>{birthDate}</span>}
        </div>
      </section>

      {(summary || strengths.length > 0) && (
        <section className={`${styles.leadStory} resume-section`}>
          <h3 className={styles.kicker}>{t('sections.summary')}</h3>
          <div className={styles.leadText}>
            <Photo data={data} className={styles.photo} />
            {summary && <p className={styles.dropCap}>{summary}</p>}
          </div>
          {strengths.length > 0 && (
            <aside className={styles.highlights}>
              <div className={styles.boxTitle}>{t('newspaper.highlights')}</div>
              <ul>
                {strengths.map((strength, i) => (
                  <li key={i}>{strength}</li>
                ))}
              </ul>
            </aside>
          )}
        </section>
      )}

      {lead && (
        <section className="resume-section">
          <h3 className={styles.sectionBar}>{t('newspaper.chronicle')}</h3>
          <article className={styles.leadArticle}>
            <div className={styles.leadHead}>
              <div className={styles.articleKicker}>
                {lead.isCurrent && <span className={styles.breaking}>{t('newspaper.breaking')}</span>}
                {range(lead.startDate, lead.endDate)}
                {lead.location ? ` · ${lead.location}` : ''}
              </div>
              <h4 className={styles.articleHead}>
                {lead.company}: {lead.position}
              </h4>
            </div>
            <div className={styles.columns}>
              {descriptionLines(lead.description).map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </article>
          {items.length > 0 && (
            <div className={styles.articleColumns}>
              {items.map((exp) => (
                <article key={exp.id} className={`${styles.article} resume-entry`}>
                  <div className={styles.articleKicker}>
                    {range(exp.startDate, exp.endDate)}
                    {exp.location ? ` · ${exp.location}` : ''}
                  </div>
                  <h4 className={styles.articleHeadSmall}>
                    {exp.company}: {exp.position}
                  </h4>
                  {descriptionLines(exp.description).map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      <div className={styles.bottom}>
        {data.education.length > 0 && (
          <section className={`${styles.archive} resume-section`}>
            <h3 className={styles.sectionBar}>{t('newspaper.archive')}</h3>
            {data.education.map((edu) => (
              <div key={edu.id} className={`${styles.archiveItem} resume-entry`}>
                <div className={styles.articleKicker}>{range(edu.startDate, edu.endDate)}</div>
                <h4 className={styles.articleHeadSmall}>{edu.institution}</h4>
                <p className={styles.degree}>
                  {edu.degree}
                  {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}
                </p>
                {edu.description && <p>{edu.description}</p>}
              </div>
            ))}
          </section>
        )}

        {data.skills.length > 0 && (
          <section className={`${styles.market} resume-section`}>
            <h3 className={styles.sectionBar}>{t('newspaper.market')}</h3>
            <table className={styles.ticker}>
              <tbody>
                {data.skills.map((skill) => (
                  <tr key={skill.id} className="resume-entry">
                    <td>{skill.name}</td>
                    <td className={styles.trend}>{skill.level ? `▲ ${skill.level}.0` : '▲'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {data.languages.length > 0 && (
          <div className={`${styles.langBox} resume-entry`}>
            <div className={styles.boxTitle}>{t('sections.languages')}</div>
            <div className={styles.langs}>
              {data.languages.map((lang) => (
                <LanguageBadge key={lang.id} language={lang} />
              ))}
            </div>
          </div>
        )}
      </div>

      <footer className={styles.footer}>
        <span>{t('newspaper.price')}</span>
        <span>{fullName}</span>
      </footer>
    </div>
  );
}
