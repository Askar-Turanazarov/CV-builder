import type { ResumeTemplateProps } from '../../types/resume';
import ContactLinks from './shared/ContactLinks';
import { EducationEntries, ExperienceEntries, LanguageItems, SkillItems, StrengthItems } from './shared/Blocks';
import { initials, useTemplateKit } from './shared/templateKit';
import styles from './MonogramTemplate.module.css';

// Stationery with a monogram: the initials in a double ring crown a centred
// header; the body is a wide column for the story and a narrow one for the
// facts, divided by a hairline with a small diamond on every heading.
export default function MonogramTemplate({ data }: ResumeTemplateProps) {
  const { t, birthDate, contactVariant, summary, strengths } = useTemplateKit(data);
  const { fullName, jobTitle } = data.personalInfo;
  const entry = {
    entry: styles.entry,
    head: styles.entryHead,
    title: styles.entryTitle,
    date: styles.entryDate,
    sub: styles.entrySub,
    text: styles.entryText,
    bullets: styles.entryText,
  };

  return (
    <div className={`${styles.page} resume-document`}>
      <header className={styles.header}>
        <div className={styles.monogram} aria-hidden="true">
          <span>{initials(fullName)}</span>
        </div>
        <h1 className={`${styles.name} resume-name`}>{fullName || '—'}</h1>
        {jobTitle && <p className={styles.role}>{jobTitle}</p>}
        <ContactLinks contacts={data.contacts} variant={contactVariant} className={styles.contacts} />
        {birthDate && <p className={styles.meta}>{birthDate}</p>}
      </header>

      {summary && (
        <section className={`${styles.summary} resume-section`}>
          <h3 className={styles.heading}>{t('sections.summary')}</h3>
          <p>{summary}</p>
        </section>
      )}

      <div className={styles.body}>
        <div className={styles.main}>
          {data.experience.length > 0 && (
            <section className="resume-section">
              <h3 className={styles.heading}>{t('sections.experience')}</h3>
              <ExperienceEntries data={data} cls={entry} />
            </section>
          )}
          {data.education.length > 0 && (
            <section className="resume-section">
              <h3 className={styles.heading}>{t('sections.education')}</h3>
              <EducationEntries data={data} cls={entry} />
            </section>
          )}
        </div>
        <aside className={styles.side}>
          {strengths.length > 0 && (
            <section className="resume-section">
              <h3 className={styles.heading}>{t('sections.strengths')}</h3>
              <StrengthItems data={data} className={styles.strengths} />
            </section>
          )}
          {data.skills.length > 0 && (
            <section className="resume-section">
              <h3 className={styles.heading}>{t('sections.skills')}</h3>
              <SkillItems data={data} cls={{ list: styles.facts, item: styles.fact, level: styles.dots }} mark="◆" />
            </section>
          )}
          {data.languages.length > 0 && (
            <section className="resume-section">
              <h3 className={styles.heading}>{t('sections.languages')}</h3>
              <LanguageItems data={data} cls={{ list: styles.facts, item: styles.fact, level: styles.factLevel }} />
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
