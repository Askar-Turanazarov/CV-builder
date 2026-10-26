import type { ResumeTemplateProps } from '../../types/resume';
import ContactLinks from './shared/ContactLinks';
import Photo from './shared/Photo';
import { EducationEntries, ExperienceEntries, LanguageItems, SkillItems, StrengthItems } from './shared/Blocks';
import { initials, useTemplateKit } from './shared/templateKit';
import styles from './ZigzagTemplate.module.css';

// A centred career line: jobs and studies sit alternately left and right of
// it, each tied to the line by a dot, under a centred header.
export default function ZigzagTemplate({ data }: ResumeTemplateProps) {
  const { t, birthDate, contactVariant, summary, strengths } = useTemplateKit(data);
  const { fullName, jobTitle } = data.personalInfo;
  const entry = {
    list: styles.line,
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
        <Photo data={data} className={styles.photo} fallback={initials(fullName)} />
        <h1 className={`${styles.name} resume-name`}>{fullName || '—'}</h1>
        {jobTitle && <p className={styles.role}>{jobTitle}</p>}
        <ContactLinks contacts={data.contacts} variant={contactVariant} className={styles.contacts} />
        {birthDate && <p className={styles.meta}>{birthDate}</p>}
      </header>

      {summary && (
        <section className={`${styles.block} resume-section`}>
          <h3 className={styles.heading}>{t('sections.summary')}</h3>
          <p className={styles.summary}>{summary}</p>
        </section>
      )}
      {data.experience.length > 0 && (
        <section className={`${styles.block} resume-section`}>
          <h3 className={styles.heading}>{t('sections.experience')}</h3>
          <ExperienceEntries data={data} cls={entry} />
        </section>
      )}
      {data.education.length > 0 && (
        <section className={`${styles.block} resume-section`}>
          <h3 className={styles.heading}>{t('sections.education')}</h3>
          <EducationEntries data={data} cls={entry} />
        </section>
      )}

      <div className={styles.bottom}>
        {strengths.length > 0 && (
          <section className={`${styles.block} resume-section`}>
            <h3 className={styles.heading}>{t('sections.strengths')}</h3>
            <StrengthItems data={data} className={styles.strengths} />
          </section>
        )}
        {data.skills.length > 0 && (
          <section className={`${styles.block} resume-section`}>
            <h3 className={styles.heading}>{t('sections.skills')}</h3>
            <SkillItems data={data} cls={items} />
          </section>
        )}
        {data.languages.length > 0 && (
          <section className={`${styles.block} resume-section`}>
            <h3 className={styles.heading}>{t('sections.languages')}</h3>
            <LanguageItems data={data} cls={items} />
          </section>
        )}
      </div>
    </div>
  );
}
