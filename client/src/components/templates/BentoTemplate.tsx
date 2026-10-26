import type { ResumeTemplateProps } from "../../types/resume";
import ContactLinks from "./shared/ContactLinks";
import Photo from "./shared/Photo";
import {
  careerYears,
  descriptionLines,
  initials,
  useTemplateKit,
} from "./shared/templateKit";
import styles from "./BentoTemplate.module.css";

// Bento box: the header is a grid of tiles of different sizes (name, photo,
// years, contacts, languages); the body continues as full-width tiles that
// may split between pages with their frame repeated.
export default function BentoTemplate({ data }: ResumeTemplateProps) {
  const { t, range, birthDate, contactVariant, summary, strengths } =
    useTemplateKit(data);
  const { fullName, jobTitle } = data.personalInfo;
  const years = careerYears(data);

  return (
    <div className={`${styles.page} resume-document`}>
      <header className={styles.bento}>
        <div className={`${styles.tile} ${styles.nameTile}`}>
          <h1 className={`${styles.name} resume-name`}>{fullName || "—"}</h1>
          {jobTitle && <div className={styles.role}>{jobTitle}</div>}
          {birthDate && <div className={styles.meta}>{birthDate}</div>}
        </div>
        <Photo
          data={data}
          className={`${styles.tile} ${styles.photoTile}`}
          fallback={initials(fullName)}
        />
        <div className={`${styles.tile} ${styles.yearsTile}`}>
          <strong>{years || data.skills.length}</strong>
          <span>
            {years
              ? t("deck.years", { count: years })
              : t("deck.skills", { count: data.skills.length })}
          </span>
        </div>
        <div className={`${styles.tile} ${styles.contactTile}`}>
          <div className={styles.label}>{t("sections.contacts")}</div>
          <ContactLinks
            contacts={data.contacts}
            variant={contactVariant}
            className={styles.contacts}
          />
        </div>
        {data.languages.length > 0 && (
          <div className={`${styles.tile} ${styles.langTile}`}>
            <div className={styles.label}>{t("sections.languages")}</div>
            <ul className={styles.langs}>
              {data.languages.map((lang) => (
                <li key={lang.id} className="language-badge">
                  <span>{lang.name}</span>
                  <span className={styles.langLevel}>
                    {lang.level === "native" ? t("nativeLanguage") : lang.level}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>

      {summary && (
        <section className={`${styles.tile} ${styles.block} resume-section`}>
          <h3 className={styles.label}>{t("sections.summary")}</h3>
          <p className={styles.summary}>{summary}</p>
        </section>
      )}

      {strengths.length > 0 && (
        <section className={`${styles.block} resume-section`}>
          <h3 className={`${styles.label} ${styles.outerLabel}`}>
            {t("sections.strengths")}
          </h3>
          <ul className={styles.strengths}>
            {strengths.map((strength, i) => (
              <li key={i} className={`${styles.tile} ${styles.mini}`}>
                <span className={styles.miniNo}>{i + 1}</span>
                {strength}
              </li>
            ))}
          </ul>
        </section>
      )}

      {data.experience.length > 0 && (
        <section className={`${styles.block} resume-section`}>
          <h3 className={`${styles.label} ${styles.outerLabel}`}>
            {t("sections.experience")}
          </h3>
          <div className={styles.stack}>
            {data.experience.map((exp) => {
              const lines = descriptionLines(exp.description);
              return (
                <article
                  key={exp.id}
                  className={`${styles.tile} ${styles.job}`}
                >
                  <div className={styles.jobHead}>
                    <span className={styles.jobTitle}>{exp.position}</span>
                    <span className={styles.chip}>
                      {range(exp.startDate, exp.endDate)}
                    </span>
                  </div>
                  <div className={styles.jobSub}>
                    {exp.company}
                    {exp.location ? ` · ${exp.location}` : ""}
                  </div>
                  {lines.map((line, j) => (
                    <p key={j} className={styles.jobLine}>
                      {line}
                    </p>
                  ))}
                </article>
              );
            })}
          </div>
        </section>
      )}

      {data.education.length > 0 && (
        <section className={`${styles.block} resume-section`}>
          <h3 className={`${styles.label} ${styles.outerLabel}`}>
            {t("sections.education")}
          </h3>
          <div className={styles.eduGrid}>
            {data.education.map((edu) => (
              <article key={edu.id} className={`${styles.tile} resume-entry`}>
                <span className={styles.chip}>
                  {range(edu.startDate, edu.endDate)}
                </span>
                <div className={styles.jobTitle}>{edu.institution}</div>
                <div className={styles.jobSub}>
                  {edu.degree}
                  {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ""}
                </div>
                {edu.description && (
                  <p className={styles.jobLine}>{edu.description}</p>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {data.skills.length > 0 && (
        <section className={`${styles.tile} ${styles.block} resume-section`}>
          <h3 className={styles.label}>{t("sections.skills")}</h3>
          <ul className={styles.skills}>
            {data.skills.map((skill) => (
              <li
                key={skill.id}
                className={`${styles.skill} skill-pill`}
                data-level={skill.level ?? 0}
              >
                {skill.name}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
