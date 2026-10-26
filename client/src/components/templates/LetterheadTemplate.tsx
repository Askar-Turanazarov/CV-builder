import type { ReactNode } from 'react';
import type { ResumeTemplateProps } from '../../types/resume';
import ContactLinks from './shared/ContactLinks';
import { EducationEntries, ExperienceEntries, LanguageItems, SkillItems, StrengthItems } from './shared/Blocks';
import { initials, useTemplateKit } from './shared/templateKit';
import styles from './LetterheadTemplate.module.css';

function Part({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={`${styles.part} resume-section`}>
      <h3 className={styles.heading}>{title}</h3>
      {children}
    </section>
  );
}

// A firm's letterhead: a monogram logo with the contacts on the right, a
// double rule, headings in the left margin and a footer line.
export default function LetterheadTemplate({ data }: ResumeTemplateProps) {
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
        <div className={styles.brand}>
          <span className={styles.logo} aria-hidden="true">
            {initials(fullName)}
          </span>
          <div>
            <h1 className={`${styles.name} resume-name`}>{fullName || '—'}</h1>
            {jobTitle && <p className={styles.role}>{jobTitle}</p>}
          </div>
        </div>
        <div className={styles.address}>
          <ContactLinks contacts={data.contacts} variant={contactVariant} className={styles.contacts} />
          {birthDate && <p>{birthDate}</p>}
        </div>
      </header>

      {summary && (
        <Part title={t('sections.summary')}>
          <p className={styles.summary}>{summary}</p>
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
      {strengths.length > 0 && (
        <Part title={t('sections.strengths')}>
          <StrengthItems data={data} className={styles.strengths} />
        </Part>
      )}
      {data.skills.length > 0 && (
        <Part title={t('sections.skills')}>
          <SkillItems data={data} cls={items} mark="▪" />
        </Part>
      )}
      {data.languages.length > 0 && (
        <Part title={t('sections.languages')}>
          <LanguageItems data={data} cls={items} />
        </Part>
      )}

      <footer className={styles.footer}>
        <span>{fullName}</span>
        {jobTitle && <span>{jobTitle}</span>}
      </footer>
    </div>
  );
}
