import type { ReactNode } from 'react';
import type { ResumeTemplateProps } from '../../types/resume';
import ContactLinks from './shared/ContactLinks';
import LanguageBadge from './shared/LanguageBadge';
import Photo from './shared/Photo';
import { descriptionLines, initials, useTemplateKit } from './shared/templateKit';
import styles from './ChatTemplate.module.css';

// The resume as a messenger conversation with a recruiter: every section
// starts with their question (grey bubble), the candidate answers in the
// theme colour with read ticks and times.
export default function ChatTemplate({ data }: ResumeTemplateProps) {
  const { t, range, birthDate, contactVariant, summary, strengths } = useTemplateKit(data);
  const { fullName, jobTitle } = data.personalInfo;
  let minute = 0;
  const time = () => {
    minute += 1;
    return `10:${String(minute).padStart(2, '0')}`;
  };

  const question = (key: string) => (
    <h3 className={`${styles.bubble} ${styles.them}`}>
      {t(`chat.ask.${key}`)}
      <span className={styles.time}>{time()}</span>
    </h3>
  );
  const answer = (content: ReactNode, key?: string, entry = true) => (
    <div key={key} className={`${styles.bubble} ${styles.me} ${entry ? 'resume-entry' : ''}`}>
      {content}
      <span className={styles.time}>
        {time()} <span className={styles.ticks}>✓✓</span>
      </span>
    </div>
  );

  return (
    <div className={`${styles.page} resume-document`}>
      <header className={styles.header}>
        <Photo data={data} className={styles.avatar} fallback={initials(fullName)} />
        <div className={styles.headText}>
          <h1 className={`${styles.name} resume-name`}>{fullName || '—'}</h1>
          <div className={styles.status}>
            <span className={styles.online} aria-hidden="true" />
            {t('chat.online')}
            {jobTitle ? ` · ${jobTitle}` : ''}
          </div>
        </div>
      </header>

      <div className={styles.thread}>
        <div className={styles.day}>
          <span>{t('chat.today')}</span>
        </div>

        <section className={`${styles.group} resume-section`}>
          {question('hello')}
          {answer(
            <>
              <p>{t('chat.intro', { name: fullName || '—', title: jobTitle || '' })}</p>
              {birthDate && <p className={styles.muted}>{birthDate}</p>}
              {summary && <p>{summary}</p>}
            </>,
          )}
        </section>

        {strengths.length > 0 && (
          <section className={`${styles.group} resume-section`}>
            {question('strengths')}
            {answer(
              <ul className={styles.list}>
                {strengths.map((strength, i) => (
                  <li key={i}>{strength}</li>
                ))}
              </ul>,
            )}
          </section>
        )}

        {data.experience.length > 0 && (
          <section className={`${styles.group} resume-section`}>
            {question('experience')}
            {data.experience.map((exp) =>
              answer(
                <>
                  <div className={styles.cardTitle}>{exp.position}</div>
                  <div className={styles.cardMeta}>
                    {exp.company} · {range(exp.startDate, exp.endDate)}
                    {exp.location ? ` · ${exp.location}` : ''}
                  </div>
                  {descriptionLines(exp.description).length > 0 && (
                    <ul className={styles.list}>
                      {descriptionLines(exp.description).map((line, j) => (
                        <li key={j}>{line}</li>
                      ))}
                    </ul>
                  )}
                </>,
                exp.id,
              ),
            )}
          </section>
        )}

        {data.education.length > 0 && (
          <section className={`${styles.group} resume-section`}>
            {question('education')}
            {data.education.map((edu) =>
              answer(
                <>
                  <div className={styles.cardTitle}>{edu.institution}</div>
                  <div className={styles.cardMeta}>
                    {edu.degree}
                    {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''} · {range(edu.startDate, edu.endDate)}
                  </div>
                  {edu.description && <p className={styles.small}>{edu.description}</p>}
                </>,
                edu.id,
              ),
            )}
          </section>
        )}

        {data.skills.length > 0 && (
          <section className={`${styles.group} resume-section`}>
            {question('skills')}
            {answer(
              <div className={styles.chips}>
                {data.skills.map((skill) => (
                  <span key={skill.id} className={`${styles.chip} skill-pill`}>
                    {skill.name}
                    {skill.level && <span className={styles.level}>{'★'.repeat(skill.level)}</span>}
                  </span>
                ))}
              </div>,
            )}
          </section>
        )}

        {data.languages.length > 0 && (
          <section className={`${styles.group} resume-section`}>
            {question('languages')}
            {answer(
              <div className={styles.chips}>
                {data.languages.map((lang) => (
                  <LanguageBadge key={lang.id} language={lang} />
                ))}
              </div>,
            )}
          </section>
        )}

        <section className={`${styles.group} resume-section`}>
          {question('contacts')}
          {answer(<ContactLinks contacts={data.contacts} variant={contactVariant} className={styles.contacts} />)}
        </section>
      </div>

      <div className={styles.composer} aria-hidden="true">
        <span className={styles.input}>{t('chat.placeholder')}</span>
        <span className={styles.send}>➤</span>
      </div>
    </div>
  );
}
