import type { ResumeTemplateProps } from "../../types/resume";
import ContactLinks from "./shared/ContactLinks";
import Photo from "./shared/Photo";
import {
  careerYears,
  descriptionLines,
  initials,
  tenureMonths,
  useTemplateKit,
  yearOf,
} from "./shared/templateKit";
import styles from "./PeriodicTemplate.module.css";

/** A chemical-style symbol: the first letter capital, the second small */
function symbol(text: string): string {
  const letters = text.replace(/[^\p{L}\p{N}]/gu, "");
  return (
    letters.charAt(0).toUpperCase() + letters.charAt(1).toLowerCase() || "?"
  );
}

// The resume as a periodic table: the person is the main element (symbol from
// the initials, atomic number = years of experience), every skill is an
// element tile with its level as the mass, jobs and studies carry badges.
export default function PeriodicTemplate({ data }: ResumeTemplateProps) {
  const { t, range, birthDate, contactVariant, summary, strengths } =
    useTemplateKit(data);
  const { fullName, jobTitle } = data.personalInfo;
  const years = careerYears(data);
  const own = initials(fullName);
  const ownSymbol = own ? own.charAt(0) + own.slice(1).toLowerCase() : "?";

  return (
    <div className={`${styles.page} resume-document`}>
      <header className={styles.header}>
        <div className={styles.hero} aria-hidden="true">
          <span className={styles.heroNo}>{years || data.skills.length}</span>
          <span className={styles.heroMass}>{data.skills.length}.0</span>
          <span className={styles.heroSymbol}>{ownSymbol}</span>
          <span className={styles.heroName}>{fullName || "—"}</span>
        </div>
        <div className={styles.intro}>
          <div className={styles.kicker}>{t("periodic.kicker")}</div>
          <h1 className={`${styles.name} resume-name`}>{fullName || "—"}</h1>
          {jobTitle && <div className={styles.role}>{jobTitle}</div>}
          <dl className={styles.props}>
            {years > 0 && (
              <div>
                <dt>{t("periodic.number")}</dt>
                <dd>
                  {years} {t("deck.years", { count: years })}
                </dd>
              </div>
            )}
            {birthDate && (
              <div>
                <dt>{t("periodic.discovered")}</dt>
                <dd>{birthDate}</dd>
              </div>
            )}
          </dl>
          <ContactLinks
            contacts={data.contacts}
            variant={contactVariant}
            className={styles.contacts}
          />
        </div>
        <Photo data={data} className={styles.photo} />
      </header>

      {summary && (
        <section className={`${styles.block} resume-section`}>
          <h3 className={styles.head}>{t("sections.summary")}</h3>
          <p className={styles.summary}>{summary}</p>
        </section>
      )}

      {data.skills.length > 0 && (
        <section className={`${styles.block} resume-section`}>
          <h3 className={styles.head}>
            {t("sections.skills")}
            <span className={styles.legend}>
              <span className={styles.legendTile} data-level="5" />{" "}
              {t("periodic.mass")}
            </span>
          </h3>
          <ul className={styles.table}>
            {data.skills.map((skill, i) => (
              <li
                key={skill.id}
                className={`${styles.element} skill-pill`}
                data-level={skill.level ?? 0}
              >
                <span className={styles.elNo}>{i + 1}</span>
                {skill.level ? (
                  <span className={styles.elMass}>{skill.level}.0</span>
                ) : null}
                <span className={styles.elSymbol}>{symbol(skill.name)}</span>
                <span className={styles.elName}>{skill.name}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {strengths.length > 0 && (
        <section className={`${styles.block} resume-section`}>
          <h3 className={styles.head}>{t("periodic.properties")}</h3>
          <ul className={styles.properties}>
            {strengths.map((strength, i) => (
              <li key={i}>{strength}</li>
            ))}
          </ul>
        </section>
      )}

      {data.experience.length > 0 && (
        <section className={`${styles.block} resume-section`}>
          <h3 className={styles.head}>{t("sections.experience")}</h3>
          {data.experience.map((exp) => {
            const lines = descriptionLines(exp.description);
            const months = tenureMonths(
              exp.startDate,
              exp.isCurrent ? null : exp.endDate,
            );
            return (
              <article
                key={exp.id}
                className={`${styles.reaction} ${lines.length < 4 ? "resume-entry" : ""}`}
              >
                <div className={styles.badge} aria-hidden="true">
                  <span className={styles.badgeNo}>
                    {yearOf(exp.startDate)}
                  </span>
                  <span className={styles.badgeSymbol}>
                    {symbol(exp.company)}
                  </span>
                  <span className={styles.badgeMass}>
                    {(months / 12).toFixed(1)}
                  </span>
                </div>
                <div className={styles.body}>
                  <div className={styles.entryHead}>
                    <b className={styles.entryTitle}>{exp.position}</b>
                    <span className={styles.date}>
                      {range(exp.startDate, exp.endDate)}
                    </span>
                  </div>
                  <div className={styles.entrySub}>
                    {exp.company}
                    {exp.location ? ` · ${exp.location}` : ""}
                  </div>
                  {lines.length > 0 && (
                    <ul className={styles.lines}>
                      {lines.map((line, j) => (
                        <li key={j}>{line}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      )}

      {data.education.length > 0 && (
        <section className={`${styles.block} resume-section`}>
          <h3 className={styles.head}>{t("sections.education")}</h3>
          {data.education.map((edu) => (
            <article key={edu.id} className={`${styles.reaction} resume-entry`}>
              <div
                className={`${styles.badge} ${styles.badgeAlt}`}
                aria-hidden="true"
              >
                <span className={styles.badgeNo}>{yearOf(edu.startDate)}</span>
                <span className={styles.badgeSymbol}>
                  {symbol(edu.institution)}
                </span>
              </div>
              <div className={styles.body}>
                <div className={styles.entryHead}>
                  <b className={styles.entryTitle}>{edu.institution}</b>
                  <span className={styles.date}>
                    {range(edu.startDate, edu.endDate)}
                  </span>
                </div>
                <div className={styles.entrySub}>
                  {edu.degree}
                  {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ""}
                </div>
                {edu.description && (
                  <p className={styles.lines}>{edu.description}</p>
                )}
              </div>
            </article>
          ))}
        </section>
      )}

      {data.languages.length > 0 && (
        <section className={`${styles.block} resume-section`}>
          <h3 className={styles.head}>{t("sections.languages")}</h3>
          <ul className={styles.langs}>
            {data.languages.map((lang) => (
              <li key={lang.id} className={`${styles.lang} language-badge`}>
                <span className={styles.langSymbol}>{symbol(lang.name)}</span>
                <span>
                  {lang.name}
                  <b className={styles.langLevel}>
                    {lang.level === "native" ? t("nativeLanguage") : lang.level}
                  </b>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
