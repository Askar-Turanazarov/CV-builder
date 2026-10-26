import type { ResumeTemplateProps } from "../../types/resume";
import ContactLinks from "./shared/ContactLinks";
import Photo from "./shared/Photo";
import {
  descriptionLines,
  initials,
  tenureMonths,
  useTemplateKit,
} from "./shared/templateKit";
import styles from "./AlbumTemplate.module.css";

/** Tenure written like a track length: 3 years 2 months → 3:02 */
function trackTime(months: number): string {
  return `${Math.floor(months / 12)}:${String(months % 12).padStart(2, "0")}`;
}

// The resume as a vinyl record: the sleeve carries the artist (name) and the
// album title (role), jobs are the tracks of side A with their tenure as the
// length, studies are side B, skills and languages are the credits.
export default function AlbumTemplate({ data }: ResumeTemplateProps) {
  const { t, range, birthDate, contactVariant, summary, strengths } =
    useTemplateKit(data);
  const { fullName, jobTitle } = data.personalInfo;
  const year = new Date().getFullYear();
  const jobMonths = data.experience.map((exp) =>
    tenureMonths(exp.startDate, exp.isCurrent ? null : exp.endDate),
  );
  const totalMonths = jobMonths.reduce((sum, months) => sum + months, 0);

  return (
    <div className={`${styles.page} resume-document`}>
      <header className={styles.sleeve}>
        <div className={styles.titles}>
          <div className={styles.kicker}>
            LP · {t("album.stereo")} · CV-{year}
          </div>
          <h1 className={`${styles.artist} resume-name`}>{fullName || "—"}</h1>
          {jobTitle && <div className={styles.album}>{jobTitle}</div>}
          {birthDate && (
            <div className={styles.meta}>
              {t("album.recorded")} {birthDate}
            </div>
          )}
          <ContactLinks
            contacts={data.contacts}
            variant={contactVariant}
            tone="inverted"
            className={styles.contacts}
          />
        </div>
        <div className={styles.disc} aria-hidden="true">
          <svg viewBox="0 0 200 200" className={styles.grooves}>
            <circle cx="100" cy="100" r="100" fill="#141414" />
            {[92, 84, 76, 68, 60, 52].map((r) => (
              <circle
                key={r}
                cx="100"
                cy="100"
                r={r}
                fill="none"
                stroke="#2c2c2c"
                strokeWidth="1.2"
              />
            ))}
            <path
              d="M100 8 A92 92 0 0 1 178 52"
              fill="none"
              stroke="#4a4a4a"
              strokeWidth="3"
            />
          </svg>
          <Photo
            data={data}
            className={styles.label}
            fallback={initials(fullName)}
          />
        </div>
      </header>

      {summary && (
        <section className={`${styles.notes} resume-section`}>
          <h3 className={styles.head}>{t("album.notes")}</h3>
          <p className={styles.summary}>{summary}</p>
        </section>
      )}

      {strengths.length > 0 && (
        <section className={`${styles.block} resume-section`}>
          <h3 className={styles.head}>{t("album.singles")}</h3>
          <ol className={styles.singles}>
            {strengths.map((strength, i) => (
              <li key={i}>
                <span className={styles.singleNo}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {strength}
              </li>
            ))}
          </ol>
        </section>
      )}

      {data.experience.length > 0 && (
        <section className={`${styles.block} resume-section`}>
          <h3 className={styles.sideHead}>
            <span className={styles.sideDot}>A</span>
            <span>{t("sections.experience")}</span>
            <span className={styles.total}>
              {t("album.total")} {trackTime(totalMonths)}
            </span>
          </h3>
          {data.experience.map((exp, i) => {
            const lines = descriptionLines(exp.description);
            return (
              <article
                key={exp.id}
                className={`${styles.track} ${lines.length < 4 ? "resume-entry" : ""}`}
              >
                <div className={styles.trackHead}>
                  <span className={styles.trackNo}>A{i + 1}</span>
                  <span className={styles.trackTitle}>{exp.position}</span>
                  <span className={styles.time}>{trackTime(jobMonths[i])}</span>
                </div>
                <div className={styles.trackSub}>
                  {t("album.feat")} {exp.company}
                  {exp.location ? ` · ${exp.location}` : ""} ·{" "}
                  {range(exp.startDate, exp.endDate)}
                </div>
                {lines.length > 0 && (
                  <ul className={styles.lyrics}>
                    {lines.map((line, j) => (
                      <li key={j}>{line}</li>
                    ))}
                  </ul>
                )}
              </article>
            );
          })}
        </section>
      )}

      {data.education.length > 0 && (
        <section className={`${styles.block} resume-section`}>
          <h3 className={styles.sideHead}>
            <span className={styles.sideDot}>B</span>
            <span>{t("sections.education")}</span>
          </h3>
          {data.education.map((edu, i) => (
            <article key={edu.id} className={`${styles.track} resume-entry`}>
              <div className={styles.trackHead}>
                <span className={styles.trackNo}>B{i + 1}</span>
                <span className={styles.trackTitle}>{edu.institution}</span>
                <span className={styles.time}>
                  {trackTime(tenureMonths(edu.startDate, edu.endDate))}
                </span>
              </div>
              <div className={styles.trackSub}>
                {edu.degree}
                {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ""} ·{" "}
                {range(edu.startDate, edu.endDate)}
              </div>
              {edu.description && (
                <p className={styles.lyrics}>{edu.description}</p>
              )}
            </article>
          ))}
        </section>
      )}

      {(data.skills.length > 0 || data.languages.length > 0) && (
        <section className={`${styles.credits} resume-section`}>
          <h3 className={styles.head}>{t("album.credits")}</h3>
          {data.skills.length > 0 && (
            <>
              <div className={styles.creditRole}>{t("album.instruments")}</div>
              <ul className={styles.instruments}>
                {data.skills.map((skill) => (
                  <li
                    key={skill.id}
                    className={`${styles.instrument} skill-pill`}
                  >
                    <span>{skill.name}</span>
                    {skill.level ? (
                      <span
                        className={styles.meter}
                        aria-label={`${skill.level}/5`}
                      >
                        {"●".repeat(skill.level)}
                        <span className={styles.meterOff}>
                          {"●".repeat(5 - skill.level)}
                        </span>
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </>
          )}
          {data.languages.length > 0 && (
            <div className={styles.vocals}>
              <span className={styles.creditRole}>{t("album.vocals")}</span>
              {data.languages.map((lang) => (
                <span
                  key={lang.id}
                  className={`${styles.vocal} language-badge`}
                >
                  {lang.name}{" "}
                  <b>
                    {lang.level === "native" ? t("nativeLanguage") : lang.level}
                  </b>
                </span>
              ))}
            </div>
          )}
        </section>
      )}

      <footer className={styles.rights}>
        {t("album.rights", { year, name: fullName || "—" })}
      </footer>
    </div>
  );
}
