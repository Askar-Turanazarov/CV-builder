import type { ReactNode } from 'react';
import type { ResumeTemplateProps } from '../../types/resume';
import ContactLinks from './shared/ContactLinks';
import { LanguageItems, SkillItems, StrengthItems } from './shared/Blocks';
import { descriptionLines, useTemplateKit } from './shared/templateKit';
import styles from './MarginaliaTemplate.module.css';

function Note({ children }: { children: ReactNode }) {
  return <span className={styles.note}>{children}</span>;
}

// A book page with a wide margin: dates and places are handwritten notes in
// the margin beside each entry, headings are italic serif.
export default function MarginaliaTemplate({ data }: ResumeTemplateProps) {
  const { t, range, birthDate, contactVariant, summary, strengths } = useTemplateKit(data);
  const { fullName, jobTitle } = data.personalInfo;
  const items = { list: styles.items, item: styles.item, level: styles.itemLevel };

  return (
    <div className={`${styles.page} resume-document`}>
      <header className={styles.header}>
        {birthDate && <Note>{birthDate}</Note>}
        <h1 className={`${styles.name} resume-name`}>{fullName || '—'}</h1>
        {jobTitle && <p className={styles.role}>{jobTitle}</p>}
        <ContactLinks contacts={data.contacts} variant={contactVariant} className={styles.contacts} />
      </header>

      {summary && (
        <section className={`${styles.section} resume-section`}>
          <h3 className={styles.heading}>{t('sections.summary')}</h3>
          <p className={styles.summary}>{summary}</p>
        </section>
      )}

      {data.experience.length > 0 && (
        <section className={`${styles.section} resume-section`}>
          <h3 className={styles.heading}>{t('sections.experience')}</h3>
          {data.experience.map((exp) => {
            const lines = descriptionLines(exp.description);
            return (
              <div key={exp.id} className={`${styles.entry} resume-entry`}>
                <Note>
                  {range(exp.startDate, exp.endDate)}
                  {exp.location && <small>{exp.location}</small>}
                </Note>
                <h4 className={styles.entryTitle}>{exp.position}</h4>
                <p className={styles.entrySub}>{exp.company}</p>
                {lines.length > 1 ? (
                  <ul className={styles.entryText}>
                    {lines.map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                ) : (
                  lines.length === 1 && <p className={styles.entryText}>{lines[0]}</p>
                )}
              </div>
            );
          })}
        </section>
      )}

      {data.education.length > 0 && (
        <section className={`${styles.section} resume-section`}>
          <h3 className={styles.heading}>{t('sections.education')}</h3>
          {data.education.map((edu) => (
            <div key={edu.id} className={`${styles.entry} resume-entry`}>
              <Note>{range(edu.startDate, edu.endDate)}</Note>
              <h4 className={styles.entryTitle}>{edu.institution}</h4>
              <p className={styles.entrySub}>
                {edu.degree}
                {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}
              </p>
              {edu.description && <p className={styles.entryText}>{edu.description}</p>}
            </div>
          ))}
        </section>
      )}

      {strengths.length > 0 && (
        <section className={`${styles.section} resume-section`}>
          <h3 className={styles.heading}>{t('sections.strengths')}</h3>
          <StrengthItems data={data} className={styles.strengths} />
        </section>
      )}
      {data.skills.length > 0 && (
        <section className={`${styles.section} resume-section`}>
          <h3 className={styles.heading}>{t('sections.skills')}</h3>
          <SkillItems data={data} cls={items} mark="✓" />
        </section>
      )}
      {data.languages.length > 0 && (
        <section className={`${styles.section} resume-section`}>
          <h3 className={styles.heading}>{t('sections.languages')}</h3>
          <LanguageItems data={data} cls={items} />
        </section>
      )}
    </div>
  );
}
