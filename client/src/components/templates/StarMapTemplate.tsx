import type { ResumeTemplateProps, SkillEntry } from '../../types/resume';
import ContactLinks from './shared/ContactLinks';
import LanguageBadge from './shared/LanguageBadge';
import Photo from './shared/Photo';
import { descriptionLines, initials, useTemplateKit } from './shared/templateKit';
import styles from './StarMapTemplate.module.css';

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

const SKY_W = 600;
const SKY_H = 220;

/**
 * Skills as a constellation: stars spread left to right with a stable
 * pseudo-random height (from the skill name), brighter for higher levels,
 * joined in order like a constellation figure.
 */
function Constellation({ skills }: { skills: SkillEntry[] }) {
  const step = (SKY_W - 60) / Math.max(1, skills.length - 1);
  const stars = skills.map((skill, i) => {
    const h = hash(skill.name);
    return {
      x: 30 + step * i + ((h % 21) - 10),
      y: 30 + ((h >>> 5) % (SKY_H - 60)),
      r: 2.5 + (skill.level ?? 3) * 0.9,
    };
  });
  const dust = Array.from({ length: 70 }, (_, i) => {
    const h = hash(`dust${i}${skills.length}`);
    return { x: h % SKY_W, y: (h >>> 10) % SKY_H, r: ((h >>> 20) % 10) / 10 + 0.3 };
  });

  return (
    <svg className={styles.sky} viewBox={`0 0 ${SKY_W} ${SKY_H}`} aria-hidden="true">
      {dust.map((d, i) => (
        <circle key={`d${i}`} cx={d.x} cy={d.y} r={d.r} className={styles.dust} />
      ))}
      <polyline points={stars.map((s) => `${s.x},${s.y}`).join(' ')} className={styles.figure} />
      {stars.map((s, i) => (
        <g key={i}>
          <circle cx={s.x} cy={s.y} r={s.r * 2.6} className={styles.glow} />
          <circle cx={s.x} cy={s.y} r={s.r} className={styles.star} />
          <text x={s.x} y={s.y - s.r - 6} className={styles.starNo}>
            {i + 1}
          </text>
        </g>
      ))}
    </svg>
  );
}

// The resume as a sky chart: the summary is the observation log, jobs are
// orbits, studies are observatories, skills form the person's constellation
// with a numbered catalogue, languages are signals.
export default function StarMapTemplate({ data }: ResumeTemplateProps) {
  const { t, range, birthDate, contactVariant, summary, strengths } = useTemplateKit(data);
  const { fullName, jobTitle } = data.personalInfo;

  return (
    <div className={`${styles.page} resume-document`}>
      <header className={styles.header}>
        <Photo data={data} className={styles.photo} fallback={initials(fullName)} />
        <div className={styles.headText}>
          <div className={styles.catalog}>{t('starMap.catalog')}</div>
          <h1 className={`${styles.name} resume-name`}>{fullName || '—'}</h1>
          {jobTitle && <p className={styles.title}>{jobTitle}</p>}
          <ContactLinks contacts={data.contacts} variant={contactVariant} tone="inverted" className={styles.contacts} />
          {birthDate && <p className={styles.meta}>{t('starMap.discovered', { date: birthDate })}</p>}
        </div>
      </header>

      {summary && (
        <section className={`${styles.block} resume-section`}>
          <h3 className={styles.heading}>{t('starMap.observations')}</h3>
          <p className={styles.log}>{summary}</p>
        </section>
      )}

      {strengths.length > 0 && (
        <section className={`${styles.block} resume-section`}>
          <h3 className={styles.heading}>{t('starMap.brightest')}</h3>
          <ul className={styles.bright}>
            {strengths.map((strength, i) => (
              <li key={i}>{strength}</li>
            ))}
          </ul>
        </section>
      )}

      {data.experience.length > 0 && (
        <section className={`${styles.block} resume-section`}>
          <h3 className={styles.heading}>{t('starMap.orbits')}</h3>
          <ol className={styles.orbits}>
            {data.experience.map((exp) => (
              <li key={exp.id} className={`${styles.orbit} resume-entry`}>
                <span className={styles.planet} data-current={exp.isCurrent} aria-hidden="true" />
                <div className={styles.orbitBody}>
                  <div className={styles.orbitTop}>
                    <span className={styles.orbitName}>{exp.company}</span>
                    <span className={styles.dates}>{range(exp.startDate, exp.endDate)}</span>
                  </div>
                  <div className={styles.role}>
                    {exp.position}
                    {exp.location ? ` · ${exp.location}` : ''}
                  </div>
                  {descriptionLines(exp.description).map((line, j) => (
                    <p key={j} className={styles.detail}>
                      {line}
                    </p>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {data.education.length > 0 && (
        <section className={`${styles.block} resume-section`}>
          <h3 className={styles.heading}>{t('starMap.observatories')}</h3>
          <div className={styles.observatories}>
            {data.education.map((edu) => (
              <div key={edu.id} className={`${styles.observatory} resume-entry`}>
                <div className={styles.dates}>{range(edu.startDate, edu.endDate)}</div>
                <div className={styles.orbitName}>{edu.institution}</div>
                <div className={styles.role}>
                  {edu.degree}
                  {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}
                </div>
                {edu.description && <p className={styles.detail}>{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {data.skills.length > 0 && (
        <section className={`${styles.block} ${styles.constellation} resume-section`}>
          <h3 className={styles.heading}>{t('starMap.constellation')}</h3>
          <Constellation skills={data.skills} />
          <ol className={styles.catalogList}>
            {data.skills.map((skill, i) => (
              <li key={skill.id}>
                <span className={styles.catNo}>{i + 1}</span>
                {skill.name}
                {skill.level && <span className={styles.magnitude}>{'✦'.repeat(skill.level)}</span>}
              </li>
            ))}
          </ol>
        </section>
      )}

      {data.languages.length > 0 && (
        <section className={`${styles.block} resume-section`}>
          <h3 className={styles.heading}>{t('starMap.signals')}</h3>
          <div className={styles.langs}>
            {data.languages.map((lang) => (
              <LanguageBadge key={lang.id} language={lang} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
