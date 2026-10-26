import type { ResumeTemplateProps } from '../../types/resume';
import ContactLinks from './shared/ContactLinks';
import Photo from './shared/Photo';
import { EducationEntries, ExperienceEntries, LanguageItems, SkillItems, StrengthItems } from './shared/Blocks';
import { initials, useTemplateKit } from './shared/templateKit';
import styles from './PhotoCardTemplate.module.css';

// A card lying on a coloured backdrop, with the round photo cut into its top
// edge; the facts sit in a tinted panel beside the story.
export default function PhotoCardTemplate({ data }: ResumeTemplateProps) {
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
      <div className={styles.backdrop} aria-hidden="true" />
      <div className={styles.card}>
        <header className={styles.header}>
          <Photo data={data} className={styles.photo} fallback={initials(fullName)} />
          <h1 className={`${styles.name} resume-name`}>{fullName || '—'}</h1>
          {jobTitle && <p className={styles.role}>{jobTitle}</p>}
          <ContactLinks contacts={data.contacts} variant={contactVariant} className={styles.contacts} />
          {birthDate && <p className={styles.meta}>{birthDate}</p>}
        </header>

        <div className={styles.body}>
          <div className={styles.main}>
            {summary && (
              <section className="resume-section">
                <h3 className={styles.heading}>{t('sections.summary')}</h3>
                <p className={styles.summary}>{summary}</p>
              </section>
            )}
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

          <aside className={styles.panel}>
            {strengths.length > 0 && (
              <section className="resume-section">
                <h3 className={styles.heading}>{t('sections.strengths')}</h3>
                <StrengthItems data={data} className={styles.strengths} />
              </section>
            )}
            {data.skills.length > 0 && (
              <section className="resume-section">
                <h3 className={styles.heading}>{t('sections.skills')}</h3>
                <SkillItems data={data} cls={{ list: styles.bars, item: styles.bar, level: styles.barLevel }} />
              </section>
            )}
            {data.languages.length > 0 && (
              <section className="resume-section">
                <h3 className={styles.heading}>{t('sections.languages')}</h3>
                <LanguageItems data={data} cls={{ list: styles.langs, item: styles.lang, level: styles.langLevel }} />
              </section>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
