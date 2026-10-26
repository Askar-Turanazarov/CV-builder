import type { ReactNode } from 'react';
import type { ResumeTemplateProps } from '../../types/resume';
import ContactLinks from './shared/ContactLinks';
import { EducationEntries, ExperienceEntries, LanguageItems, SkillItems, StrengthItems } from './shared/Blocks';
import { initials, useTemplateKit } from './shared/templateKit';
import styles from './ZenTemplate.module.css';

function Part({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={`${styles.part} resume-section`}>
      <h3 className={styles.heading}>{title}</h3>
      {children}
    </section>
  );
}

// Japanese minimalism: lots of air, headings set vertically in a narrow
// column on the left, thin ink rules and a red hanko seal with the initials.
export default function ZenTemplate({ data }: ResumeTemplateProps) {
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
        <div>
          <h1 className={`${styles.name} resume-name`}>{fullName || '—'}</h1>
          {jobTitle && <p className={styles.role}>{jobTitle}</p>}
          <ContactLinks contacts={data.contacts} variant={contactVariant} className={styles.contacts} />
          {birthDate && <p className={styles.meta}>{birthDate}</p>}
        </div>
        <div className={styles.seal} aria-hidden="true">
          {initials(fullName)}
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
          <SkillItems data={data} cls={items} mark="・" />
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
