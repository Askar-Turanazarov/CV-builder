import type { ResumeTemplateProps } from '../../types/resume';
import ContactLinks from './shared/ContactLinks';
import LanguageBadge from './shared/LanguageBadge';
import { descriptionLines, initials, useTemplateKit, yearOf } from './shared/templateKit';
import styles from './BoardingPassTemplate.module.css';

/** Stable small number from text, so gate, seat and barcode don't change between renders */
function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** "Kepler Wormhole" → "KEP", like an airport code */
function airportCode(text: string): string {
  const letters = text.replace(/[^\p{L}]/gu, '').toUpperCase();
  return (letters.slice(0, 3) || '———').padEnd(3, 'X');
}

function Barcode({ seed, className }: { seed: string; className?: string }) {
  let h = hash(seed);
  const bars: { x: number; w: number }[] = [];
  let x = 0;
  while (x < 200) {
    h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0;
    const w = 1 + (h % 4);
    bars.push({ x, w });
    x += w + 1 + ((h >>> 4) % 3);
  }
  return (
    <svg className={className} viewBox="0 0 200 40" preserveAspectRatio="none" aria-hidden="true">
      {bars.map((bar, i) => (
        <rect key={i} x={bar.x} y="0" width={bar.w} height="40" />
      ))}
    </svg>
  );
}

// The resume as a boarding pass: the ticket flies from the current company
// to the desired role; the jobs below are the legs of the route, studies are
// the layovers, skills are the checked baggage.
export default function BoardingPassTemplate({ data }: ResumeTemplateProps) {
  const { t, range, birthDate, contactVariant, summary, strengths } = useTemplateKit(data);
  const { fullName, jobTitle } = data.personalInfo;
  const latest = data.experience[0];
  const fromCode = latest ? airportCode(latest.company) : '———';
  const toCode = airportCode(jobTitle || fullName);
  const seed = hash(fullName + jobTitle);
  const firstYear = Math.min(...data.experience.map((exp) => Number(yearOf(exp.startDate))), new Date().getFullYear());
  const years = Math.max(1, new Date().getFullYear() - firstYear);
  const flight = `${initials(fullName).replace('—', 'CV')} ${String((seed % 900) + 100)}`;
  const gate = `${String.fromCharCode(65 + (seed % 6))}${((seed >>> 3) % 30) + 1}`;
  const seat = `${((seed >>> 7) % 9) + 1}${'ABCDEF'[(seed >>> 11) % 6]}`;

  const fields: [string, string][] = [
    [t('boardingPass.flight'), flight],
    [t('boardingPass.gate'), gate],
    [t('boardingPass.seat'), seat],
    [t('boardingPass.boarding'), t('boardingPass.now')],
    [t('boardingPass.class'), t('boardingPass.business')],
    [t('boardingPass.miles'), t('boardingPass.years', { count: years })],
  ];

  return (
    <div className={`${styles.page} resume-document`}>
      <header className={styles.ticket}>
        <div className={styles.main}>
          <div className={styles.airline}>
            <span className={styles.plane} aria-hidden="true">
              ✈
            </span>
            {t('boardingPass.airline')}
            <span className={styles.passLabel}>{t('boardingPass.title')}</span>
          </div>

          <div className={styles.route}>
            <div className={styles.port}>
              <div className={styles.code}>{fromCode}</div>
              <div className={styles.portName}>{latest?.company ?? '—'}</div>
            </div>
            <div className={styles.path} aria-hidden="true">
              <span>✈</span>
            </div>
            <div className={`${styles.port} ${styles.portTo}`}>
              <div className={styles.code}>{toCode}</div>
              <div className={styles.portName}>{jobTitle || '—'}</div>
            </div>
          </div>

          <div className={styles.passenger}>
            <div className={styles.label}>{t('boardingPass.passenger')}</div>
            <h1 className={`${styles.name} resume-name`}>{fullName || '—'}</h1>
            {birthDate && <div className={styles.small}>{birthDate}</div>}
          </div>

          <dl className={styles.fields}>
            {fields.map(([label, value]) => (
              <div key={label}>
                <dt className={styles.label}>{label}</dt>
                <dd className={styles.value}>{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className={styles.stub}>
          <div className={styles.label}>{t('boardingPass.passenger')}</div>
          <div className={styles.stubName}>{fullName || '—'}</div>
          <div className={styles.stubRoute}>
            {fromCode} <span aria-hidden="true">→</span> {toCode}
          </div>
          <div className={styles.stubFields}>
            <span>
              <span className={styles.label}>{t('boardingPass.gate')}</span> {gate}
            </span>
            <span>
              <span className={styles.label}>{t('boardingPass.seat')}</span> {seat}
            </span>
          </div>
          <Barcode seed={fullName + jobTitle} className={styles.barcode} />
        </div>
      </header>

      <div className={styles.contactsRow}>
        <ContactLinks contacts={data.contacts} variant={contactVariant} />
      </div>

      {summary && (
        <section className={`${styles.block} resume-section`}>
          <h3 className={styles.heading}>
            <span aria-hidden="true">🎙</span> {t('boardingPass.captain')}
          </h3>
          <p className={styles.announcement}>{summary}</p>
        </section>
      )}

      {strengths.length > 0 && (
        <section className={`${styles.block} resume-section`}>
          <h3 className={styles.heading}>{t('boardingPass.included')}</h3>
          <ul className={styles.included}>
            {strengths.map((strength, i) => (
              <li key={i}>{strength}</li>
            ))}
          </ul>
        </section>
      )}

      {data.experience.length > 0 && (
        <section className={`${styles.block} resume-section`}>
          <h3 className={styles.heading}>{t('boardingPass.itinerary')}</h3>
          <ol className={styles.legs}>
            {data.experience.map((exp, i) => (
              <li key={exp.id} className={styles.leg}>
                <div className={styles.legSide}>
                  <div className={styles.legCode}>{airportCode(exp.company)}</div>
                  <div className={styles.legNo}>{t('boardingPass.leg', { n: data.experience.length - i })}</div>
                </div>
                <div className={styles.legBody}>
                  <div className={styles.legTop}>
                    <span className={styles.legTitle}>{exp.company}</span>
                    <span className={styles.legDates}>{range(exp.startDate, exp.endDate)}</span>
                  </div>
                  <div className={styles.legRole}>
                    {exp.position}
                    {exp.location ? ` · ${exp.location}` : ''}
                    {exp.isCurrent && <span className={styles.status}>{t('boardingPass.inFlight')}</span>}
                  </div>
                  {descriptionLines(exp.description).length > 0 && (
                    <ul className={styles.legNotes}>
                      {descriptionLines(exp.description).map((line, j) => (
                        <li key={j}>{line}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {data.education.length > 0 && (
        <section className={`${styles.block} resume-section`}>
          <h3 className={styles.heading}>{t('boardingPass.layovers')}</h3>
          <div className={styles.layovers}>
            {data.education.map((edu) => (
              <div key={edu.id} className={`${styles.layover} resume-entry`}>
                <div className={styles.legDates}>{range(edu.startDate, edu.endDate)}</div>
                <div className={styles.legTitle}>{edu.institution}</div>
                <div className={styles.legRole}>
                  {edu.degree}
                  {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}
                </div>
                {edu.description && <p className={styles.small}>{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {data.skills.length > 0 && (
        <section className={`${styles.block} resume-section`}>
          <h3 className={styles.heading}>{t('boardingPass.baggage')}</h3>
          <ul className={styles.tags}>
            {data.skills.map((skill) => (
              <li key={skill.id} className={`${styles.tag} skill-pill`}>
                <span className={styles.tagHole} aria-hidden="true" />
                <span className={styles.tagName}>{skill.name}</span>
                {skill.level && (
                  <span className={styles.tagWeight}>{t('boardingPass.kg', { n: skill.level * 5 })}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {data.languages.length > 0 && (
        <section className={`${styles.block} resume-section`}>
          <h3 className={styles.heading}>{t('boardingPass.crew')}</h3>
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
