import type { ResumeTemplateProps } from '../../types/resume';
import ContactLinks from './shared/ContactLinks';
import { EducationEntries, ExperienceEntries, LanguageItems, SkillItems, StrengthItems } from './shared/Blocks';
import { longestWordStyle, useTemplateKit } from './shared/templateKit';
import styles from './BauhausTemplate.module.css';

type Shape = 'circle' | 'square' | 'triangle';

function Heading({ shape, children }: { shape: Shape; children: string }) {
  return (
    <h3 className={styles.heading}>
      <span className={styles.shape} data-shape={shape} aria-hidden="true" />
      {children}
    </h3>
  );
}

// Bauhaus poster geometry: a composition of a circle, a square and a
// triangle in primary colours next to a heavy condensed name; every heading
// carries one of the three shapes, black rules divide the grid.
export default function BauhausTemplate({ data }: ResumeTemplateProps) {
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
        <div>
          <h1 className={`${styles.name} resume-name`} style={longestWordStyle(fullName)}>
            {fullName || '—'}
          </h1>
          {jobTitle && <p className={styles.role}>{jobTitle}</p>}
        </div>
        <div className={styles.composition} aria-hidden="true">
          <span className={styles.circle} />
          <span className={styles.square} />
          <span className={styles.triangle} />
        </div>
      </header>

      <div className={styles.contactStrip}>
        <ContactLinks contacts={data.contacts} variant={contactVariant} />
        {birthDate && <span>{birthDate}</span>}
      </div>

      <div className={styles.grid}>
        <div className={styles.main}>
          {summary && (
            <section className="resume-section">
              <Heading shape="circle">{t('sections.summary')}</Heading>
              <p className={styles.summary}>{summary}</p>
            </section>
          )}
          {data.experience.length > 0 && (
            <section className="resume-section">
              <Heading shape="square">{t('sections.experience')}</Heading>
              <ExperienceEntries data={data} cls={entry} />
            </section>
          )}
          {data.education.length > 0 && (
            <section className="resume-section">
              <Heading shape="triangle">{t('sections.education')}</Heading>
              <EducationEntries data={data} cls={entry} />
            </section>
          )}
        </div>

        <aside className={styles.side}>
          {strengths.length > 0 && (
            <section className="resume-section">
              <Heading shape="triangle">{t('sections.strengths')}</Heading>
              <StrengthItems data={data} className={styles.strengths} />
            </section>
          )}
          {data.skills.length > 0 && (
            <section className="resume-section">
              <Heading shape="circle">{t('sections.skills')}</Heading>
              <SkillItems
                data={data}
                cls={{ list: styles.blocks, item: styles.block, level: styles.blockLevel }}
                mark="■"
              />
            </section>
          )}
          {data.languages.length > 0 && (
            <section className="resume-section">
              <Heading shape="square">{t('sections.languages')}</Heading>
              <LanguageItems data={data} cls={{ list: styles.blocks, item: styles.block, level: styles.blockLevel }} />
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
