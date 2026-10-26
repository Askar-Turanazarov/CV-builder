import type { ReactNode } from 'react';
import type { ResumeTemplateProps } from '../../types/resume';
import ContactLinks from './shared/ContactLinks';
import Photo from './shared/Photo';
import { EducationEntries, ExperienceEntries, LanguageItems, SkillItems, StrengthItems } from './shared/Blocks';
import { careerYears, initials, useTemplateKit } from './shared/templateKit';
import styles from './DeckTemplate.module.css';

function Slide({ n, total, title, children }: { n: number; total: number; title: string; children: ReactNode }) {
  return (
    <section className={`${styles.slide} resume-section`}>
      <h3 className={styles.slideTitle}>
        <span>{title}</span>
        <span className={styles.slideNumber}>
          {String(n).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </h3>
      {children}
    </section>
  );
}

// A corporate deck: a title slide with KPI tiles, then one numbered slide per
// section with a coloured title bar.
export default function DeckTemplate({ data }: ResumeTemplateProps) {
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

  const years = careerYears(data);
  const companies = new Set(data.experience.map((exp) => exp.company.trim()).filter(Boolean)).size;
  const kpis = [
    { value: years, label: t('deck.years', { count: years }) },
    { value: companies, label: t('deck.companies', { count: companies }) },
    { value: data.skills.length, label: t('deck.skills', { count: data.skills.length }) },
    { value: data.languages.length, label: t('deck.languages', { count: data.languages.length }) },
  ].filter((kpi) => kpi.value > 0);

  const slides: { title: string; body: ReactNode }[] = [];
  if (summary || strengths.length > 0)
    slides.push({
      title: t('sections.summary'),
      body: (
        <div className={styles.about}>
          {summary && <p className={styles.summary}>{summary}</p>}
          {strengths.length > 0 && <StrengthItems data={data} className={styles.strengths} />}
        </div>
      ),
    });
  if (data.experience.length > 0)
    slides.push({ title: t('sections.experience'), body: <ExperienceEntries data={data} cls={entry} /> });
  if (data.education.length > 0)
    slides.push({ title: t('sections.education'), body: <EducationEntries data={data} cls={entry} /> });
  if (data.skills.length > 0 || data.languages.length > 0)
    slides.push({
      title: `${t('sections.skills')} · ${t('sections.languages')}`,
      body: (
        <div className={styles.twoUp}>
          {data.skills.length > 0 && <SkillItems data={data} cls={items} mark="▮" />}
          {data.languages.length > 0 && <LanguageItems data={data} cls={items} />}
        </div>
      ),
    });
  const total = slides.length + 1;

  return (
    <div className={`${styles.page} resume-document`}>
      <header className={styles.cover}>
        <div className={styles.coverText}>
          <h1 className={`${styles.name} resume-name`}>{fullName || '—'}</h1>
          {jobTitle && <p className={styles.role}>{jobTitle}</p>}
          <ContactLinks contacts={data.contacts} variant={contactVariant} className={styles.contacts} />
          {birthDate && <p className={styles.meta}>{birthDate}</p>}
        </div>
        <Photo data={data} className={styles.photo} fallback={initials(fullName)} />
        {kpis.length > 0 && (
          <ul className={styles.kpis}>
            {kpis.map((kpi) => (
              <li key={kpi.label} className={styles.kpi}>
                <strong>{kpi.value}</strong>
                <span>{kpi.label}</span>
              </li>
            ))}
          </ul>
        )}
        <span className={styles.coverNumber}>01 / {String(total).padStart(2, '0')}</span>
      </header>

      {slides.map((slide, i) => (
        <Slide key={slide.title} n={i + 2} total={total} title={slide.title}>
          {slide.body}
        </Slide>
      ))}
    </div>
  );
}
