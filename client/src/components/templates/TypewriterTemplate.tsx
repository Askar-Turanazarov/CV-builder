import type { ReactNode } from 'react';
import type { ResumeTemplateProps } from '../../types/resume';
import ContactLinks from './shared/ContactLinks';
import { EducationEntries, ExperienceEntries, LanguageItems, SkillItems } from './shared/Blocks';
import { useTemplateKit } from './shared/templateKit';
import styles from './TypewriterTemplate.module.css';

function Part({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={`${styles.part} resume-section`}>
      <h3 className={styles.heading}>{title}</h3>
      {children}
    </section>
  );
}

// A typed sheet: monospaced text on warm paper with a faint ruled margin,
// underlined capital headings, ticked boxes and a red rubber stamp.
export default function TypewriterTemplate({ data }: ResumeTemplateProps) {
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
  const items = { list: styles.items, item: styles.item, level: styles.itemLevel };

  return (
    <div className={`${styles.page} resume-document`}>
      <header className={styles.header}>
        <h1 className={`${styles.name} resume-name`}>{fullName || '—'}</h1>
        {jobTitle && <p className={styles.role}>{jobTitle}</p>}
        <ContactLinks contacts={data.contacts} variant={contactVariant} className={styles.contacts} />
        {birthDate && <p className={styles.meta}>{birthDate}</p>}
        <span className={styles.stamp} aria-hidden="true">
          {t('typewriter.stamp')}
        </span>
      </header>

      {summary && (
        <Part title={t('sections.summary')}>
          <p className={styles.summary}>{summary}</p>
        </Part>
      )}
      {strengths.length > 0 && (
        <Part title={t('sections.strengths')}>
          <ul className={styles.checks}>
            {strengths.map((strength, i) => (
              <li key={i}>{strength}</li>
            ))}
          </ul>
        </Part>
      )}
      {data.experience.length > 0 && (
        <Part title={t('sections.experience')}>
          <ExperienceEntries data={data} cls={entry} />
        </Part>
      )}
      {data.education.length > 0 && (
        <Part title={t('sections.education')}>
          <EducationEntries data={data} cls={entry} />
        </Part>
      )}
      {data.skills.length > 0 && (
        <Part title={t('sections.skills')}>
          <SkillItems data={data} cls={items} mark="*" />
        </Part>
      )}
      {data.languages.length > 0 && (
        <Part title={t('sections.languages')}>
          <LanguageItems data={data} cls={items} />
        </Part>
      )}
    </div>
  );
}
