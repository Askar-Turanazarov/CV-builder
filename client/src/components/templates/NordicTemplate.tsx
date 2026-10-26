import type { ReactNode } from 'react';
import type { ResumeTemplateProps } from '../../types/resume';
import ContactLinks from './shared/ContactLinks';
import Photo from './shared/Photo';
import { EducationEntries, ExperienceEntries, LanguageItems, SkillItems, StrengthItems } from './shared/Blocks';
import { initials, useTemplateKit } from './shared/templateKit';
import styles from './NordicTemplate.module.css';

type Tint = 'sage' | 'sky' | 'sand' | 'blush';

function Card({ title, tint, children }: { title: string; tint: Tint; children: ReactNode }) {
  return (
    <section className={`${styles.card} resume-section`} data-tint={tint}>
      <h3 className={styles.heading}>{title}</h3>
      {children}
    </section>
  );
}

// Scandinavian calm: soft pastel cards with round corners on an off-white
// page, a light sans and lots of rounded shapes.
export default function NordicTemplate({ data }: ResumeTemplateProps) {
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
  const items = { list: styles.chips, item: styles.chip, level: styles.chipLevel };

  return (
    <div className={`${styles.page} resume-document`}>
      <header className={styles.header}>
        <Photo data={data} className={styles.photo} fallback={initials(fullName)} />
        <div>
          <h1 className={`${styles.name} resume-name`}>{fullName || '—'}</h1>
          {jobTitle && <p className={styles.role}>{jobTitle}</p>}
          <ContactLinks contacts={data.contacts} variant={contactVariant} className={styles.contacts} />
          {birthDate && <p className={styles.meta}>{birthDate}</p>}
        </div>
      </header>

      {summary && (
        <Card title={t('sections.summary')} tint="sky">
          <p className={styles.summary}>{summary}</p>
        </Card>
      )}
      {data.experience.length > 0 && (
        <Card title={t('sections.experience')} tint="sage">
          <ExperienceEntries data={data} cls={entry} />
        </Card>
      )}
      {data.education.length > 0 && (
        <Card title={t('sections.education')} tint="sand">
          <EducationEntries data={data} cls={entry} />
        </Card>
      )}
      {strengths.length > 0 && (
        <Card title={t('sections.strengths')} tint="blush">
          <StrengthItems data={data} className={styles.strengths} />
        </Card>
      )}
      <div className={styles.pair}>
        {data.skills.length > 0 && (
          <Card title={t('sections.skills')} tint="sky">
            <SkillItems data={data} cls={items} mark="•" />
          </Card>
        )}
        {data.languages.length > 0 && (
          <Card title={t('sections.languages')} tint="sand">
            <LanguageItems data={data} cls={items} />
          </Card>
        )}
      </div>
    </div>
  );
}
