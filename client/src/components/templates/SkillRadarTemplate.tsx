import type { ResumeData, ResumeTemplateProps } from '../../types/resume';
import ContactLinks from './shared/ContactLinks';
import Photo from './shared/Photo';
import { EducationEntries, ExperienceEntries, LanguageItems, StrengthItems } from './shared/Blocks';
import { initials, useTemplateKit } from './shared/templateKit';
import styles from './SkillRadarTemplate.module.css';

const SIZE = 200;
const CENTER = SIZE / 2;
const RADIUS = 78;

function point(i: number, n: number, r: number) {
  const angle = -Math.PI / 2 + (2 * Math.PI * i) / n;
  return [CENTER + r * Math.cos(angle), CENTER + r * Math.sin(angle)].map((v) => v.toFixed(1)).join(',');
}

// Skills with a level drawn as a radar: one axis per skill, numbered so the
// long names can sit in the list below instead of crowding the chart.
function Radar({ data }: { data: ResumeData }) {
  const skills = data.skills.filter((skill) => skill.level).slice(0, 8);
  if (skills.length < 3) return null;
  const n = skills.length;
  const ring = (k: number) => skills.map((_, i) => point(i, n, (RADIUS * k) / 5)).join(' ');

  return (
    <svg className={styles.radar} viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true">
      {[1, 2, 3, 4, 5].map((k) => (
        <polygon key={k} points={ring(k)} className={styles.ring} />
      ))}
      {skills.map((_, i) => (
        <line key={i} x1={CENTER} y1={CENTER} {...axisEnd(i, n)} className={styles.axis} />
      ))}
      <polygon
        points={skills.map((skill, i) => point(i, n, (RADIUS * (skill.level ?? 0)) / 5)).join(' ')}
        className={styles.area}
      />
      {skills.map((_, i) => {
        const [x, y] = point(i, n, RADIUS + 12).split(',');
        return (
          <text key={i} x={x} y={y} className={styles.axisLabel}>
            {i + 1}
          </text>
        );
      })}
    </svg>
  );
}

function axisEnd(i: number, n: number) {
  const [x2, y2] = point(i, n, RADIUS).split(',');
  return { x2, y2 };
}

export default function SkillRadarTemplate({ data }: ResumeTemplateProps) {
  const { t, birthDate, contactVariant, summary, strengths } = useTemplateKit(data);
  const { fullName, jobTitle } = data.personalInfo;
  const ranked = data.skills.filter((skill) => skill.level).slice(0, 8);
  const rest = data.skills.filter((skill) => !ranked.includes(skill));
  const showRadar = ranked.length >= 3;
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
      <div className={styles.layout}>
        <aside className={styles.side}>
          <Photo data={data} className={styles.photo} fallback={initials(fullName)} />
          <h1 className={`${styles.name} resume-name`}>{fullName || '—'}</h1>
          {jobTitle && <p className={styles.role}>{jobTitle}</p>}
          <ContactLinks contacts={data.contacts} variant={contactVariant} className={styles.contacts} />
          {birthDate && <p className={styles.meta}>{birthDate}</p>}

          {data.skills.length > 0 && (
            <section className="resume-section">
              <h3 className={styles.sideHeading}>{showRadar ? t('skillRadar.title') : t('sections.skills')}</h3>
              <Radar data={data} />
              <ol className={styles.legend}>
                {(showRadar ? ranked : data.skills).map((skill) => (
                  <li key={skill.id} className="skill-pill">
                    <span>{skill.name}</span>
                    {skill.level && <span className={styles.legendLevel}>{skill.level}/5</span>}
                  </li>
                ))}
              </ol>
              {showRadar && rest.length > 0 && (
                <p className={styles.more}>{rest.map((skill) => skill.name).join(' · ')}</p>
              )}
            </section>
          )}

          {data.languages.length > 0 && (
            <section className="resume-section">
              <h3 className={styles.sideHeading}>{t('sections.languages')}</h3>
              <LanguageItems data={data} cls={{ list: styles.langs, item: styles.lang, level: styles.langLevel }} />
            </section>
          )}
        </aside>

        <main className={styles.main}>
          {summary && (
            <section className="resume-section">
              <h3 className={styles.heading}>{t('sections.summary')}</h3>
              <p className={styles.summary}>{summary}</p>
            </section>
          )}
          {strengths.length > 0 && (
            <section className="resume-section">
              <h3 className={styles.heading}>{t('sections.strengths')}</h3>
              <StrengthItems data={data} className={styles.strengths} />
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
        </main>
      </div>
    </div>
  );
}
