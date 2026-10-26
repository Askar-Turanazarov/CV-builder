import type { ResumeTemplateProps } from '../../types/resume';
import ContactLinks from './shared/ContactLinks';
import Photo from './shared/Photo';
import { EducationEntries, ExperienceEntries, LanguageItems, SkillItems, StrengthItems } from './shared/Blocks';
import { careerYears, longestWordStyle, useTemplateKit } from './shared/templateKit';
import styles from './MagazineTemplate.module.css';

// An asymmetric magazine spread: an oversized name over a cover photo, the
// years of experience as a cover number, the summary as a pull quote, then
// a narrow "sidebar" column next to a wide feature column.
export default function MagazineTemplate({ data }: ResumeTemplateProps) {
  const { t, birthDate, contactVariant, summary, strengths } = useTemplateKit(data);
  const { fullName, jobTitle } = data.personalInfo;
  const years = careerYears(data);

  return (
    <div className={`${styles.page} resume-document`}>
      <header className={styles.cover}>
        <div className={styles.coverText}>
          <div className={styles.issue}>{t('magazine.feature')}</div>
          <h1 className={`${styles.name} resume-name`} style={longestWordStyle(fullName)}>
            {fullName || '—'}
          </h1>
          {jobTitle && <p className={styles.role}>{jobTitle}</p>}
        </div>
        <div className={styles.coverSide}>
          <Photo data={data} className={styles.photo} />
          {years > 0 && (
            <div className={styles.number}>
              <span className={styles.numberValue}>{years}</span>
              <span className={styles.numberLabel}>{t('magazine.years', { count: years })}</span>
            </div>
          )}
        </div>
      </header>

      <div className={styles.contactBar}>
        <ContactLinks contacts={data.contacts} variant={contactVariant} />
        {birthDate && <span>{birthDate}</span>}
      </div>

      {summary && (
        <section className={`${styles.quote} resume-section`}>
          <h3 className={styles.quoteLabel}>{t('sections.summary')}</h3>
          <blockquote className={styles.quoteText}>{summary}</blockquote>
        </section>
      )}

      <div className={styles.spread}>
        <aside className={styles.aside}>
          {strengths.length > 0 && (
            <section className={`${styles.box} resume-section`}>
              <h3 className={styles.asideHead}>{t('sections.strengths')}</h3>
              <StrengthItems data={data} className={styles.strengths} />
            </section>
          )}
          {data.skills.length > 0 && (
            <section className={`${styles.box} resume-section`}>
              <h3 className={styles.asideHead}>{t('sections.skills')}</h3>
              <SkillItems data={data} cls={{ list: styles.skills, item: styles.skill, level: styles.level }} mark="▮" />
            </section>
          )}
          {data.languages.length > 0 && (
            <section className={`${styles.box} resume-section`}>
              <h3 className={styles.asideHead}>{t('sections.languages')}</h3>
              <LanguageItems data={data} cls={{ list: styles.langs, item: styles.lang, level: styles.langLevel }} />
            </section>
          )}
        </aside>

        <main className={styles.feature}>
          {data.experience.length > 0 && (
            <section className="resume-section">
              <h3 className={styles.featureHead}>{t('sections.experience')}</h3>
              <ExperienceEntries
                data={data}
                cls={{
                  entry: styles.story,
                  head: styles.storyHead,
                  title: styles.storyTitle,
                  date: styles.storyDate,
                  sub: styles.storySub,
                  text: styles.storyText,
                  bullets: styles.storyText,
                }}
              />
            </section>
          )}
          {data.education.length > 0 && (
            <section className="resume-section">
              <h3 className={styles.featureHead}>{t('sections.education')}</h3>
              <EducationEntries
                data={data}
                cls={{
                  entry: styles.story,
                  head: styles.storyHead,
                  title: styles.storyTitle,
                  date: styles.storyDate,
                  sub: styles.storySub,
                  text: styles.storyText,
                }}
              />
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
