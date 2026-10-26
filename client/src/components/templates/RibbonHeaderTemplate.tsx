import type { ResumeTemplateProps } from '../../types/resume';
import ContactLinks from './shared/ContactLinks';
import { EducationEntries, ExperienceEntries, LanguageItems, SkillItems, StrengthItems } from './shared/Blocks';
import { useTemplateKit } from './shared/templateKit';
import styles from './RibbonHeaderTemplate.module.css';

// The name on a ribbon banner whose ends fold behind the page, section titles
// on small ribbon tabs, and a two-column body under it.
export default function RibbonHeaderTemplate({ data }: ResumeTemplateProps) {
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
        <div className={styles.ribbon}>
          <h1 className={`${styles.name} resume-name`}>{fullName || '—'}</h1>
        </div>
        {jobTitle && <p className={styles.role}>{jobTitle}</p>}
        <ContactLinks contacts={data.contacts} variant={contactVariant} className={styles.contacts} />
        {birthDate && <p className={styles.meta}>{birthDate}</p>}
      </header>

      {summary && (
        <section className={`${styles.intro} resume-section`}>
          <h3 className={styles.tab}>{t('sections.summary')}</h3>
          <p className={styles.summary}>{summary}</p>
        </section>
      )}

      <div className={styles.columns}>
        <div>
          {data.experience.length > 0 && (
            <section className="resume-section">
              <h3 className={styles.tab}>{t('sections.experience')}</h3>
              <ExperienceEntries data={data} cls={entry} />
            </section>
          )}
          {data.education.length > 0 && (
            <section className="resume-section">
              <h3 className={styles.tab}>{t('sections.education')}</h3>
              <EducationEntries data={data} cls={entry} />
            </section>
          )}
        </div>
        <div>
          {strengths.length > 0 && (
            <section className="resume-section">
              <h3 className={styles.tab}>{t('sections.strengths')}</h3>
              <StrengthItems data={data} className={styles.strengths} />
            </section>
          )}
          {data.skills.length > 0 && (
            <section className="resume-section">
              <h3 className={styles.tab}>{t('sections.skills')}</h3>
              <SkillItems data={data} cls={items} mark="★" />
            </section>
          )}
          {data.languages.length > 0 && (
            <section className="resume-section">
              <h3 className={styles.tab}>{t('sections.languages')}</h3>
              <LanguageItems data={data} cls={items} />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
