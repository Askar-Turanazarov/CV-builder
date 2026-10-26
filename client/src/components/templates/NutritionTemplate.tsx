import type { ResumeTemplateProps } from "../../types/resume";
import ContactLinks from "./shared/ContactLinks";
import Photo from "./shared/Photo";
import {
  careerYears,
  descriptionLines,
  useTemplateKit,
} from "./shared/templateKit";
import styles from "./NutritionTemplate.module.css";

// The resume as a food label: serving = the role, the big number is years of
// experience, skills are nutrients with "% daily value", strengths are the
// ingredients list, jobs and studies are the detailed rows.
export default function NutritionTemplate({ data }: ResumeTemplateProps) {
  const { t, range, birthDate, contactVariant, summary, strengths } =
    useTemplateKit(data);
  const { fullName, jobTitle } = data.personalInfo;
  const years = careerYears(data);

  return (
    <div className={`${styles.page} resume-document`}>
      <div className={styles.label}>
        <header className={styles.header}>
          <div className={styles.headText}>
            <div className={styles.facts}>{t("nutrition.facts")}</div>
            <h1 className={`${styles.name} resume-name`}>{fullName || "—"}</h1>
            {jobTitle && (
              <div className={styles.serving}>
                {t("nutrition.serving")} <b>{jobTitle}</b>
              </div>
            )}
            {birthDate && (
              <div className={styles.serving}>
                {t("nutrition.produced")} <b>{birthDate}</b>
              </div>
            )}
          </div>
          <div className={styles.side}>
            <Photo data={data} className={styles.photo} />
            <div className={styles.badge} aria-hidden="true">
              {t("nutrition.badge")}
            </div>
          </div>
        </header>

        <div className={styles.contacts}>
          <ContactLinks contacts={data.contacts} variant={contactVariant} />
        </div>

        {years > 0 && (
          <div className={styles.calories}>
            <span>{t("nutrition.experience")}</span>
            <strong>{years}</strong>
            <span className={styles.unit}>
              {t("nutrition.years", { count: years })}
            </span>
          </div>
        )}

        {summary && (
          <section className={`${styles.block} resume-section`}>
            <h3 className={styles.rowLabel}>{t("nutrition.description")}</h3>
            <p className={styles.summary}>{summary}</p>
          </section>
        )}

        {strengths.length > 0 && (
          <section className={`${styles.ingredients} resume-section`}>
            <h3 className={styles.inline}>{t("nutrition.ingredients")}:</h3>{" "}
            {strengths.map((strength, i) => (
              <span key={i}>
                {strength.replace(/[.;]\s*$/, "")}
                {i < strengths.length - 1 ? "; " : "."}
              </span>
            ))}
          </section>
        )}

        {data.skills.length > 0 && (
          <section className={`${styles.block} resume-section`}>
            <h3 className={styles.dvHead}>
              <span>{t("sections.skills")}</span>
              <span>{t("nutrition.dailyValue")}*</span>
            </h3>
            <ul className={styles.nutrients}>
              {data.skills.map((skill) => (
                <li key={skill.id} className={`${styles.nutrient} skill-pill`}>
                  <b>{skill.name}</b>
                  {skill.level && (
                    <span className={styles.pct}>{skill.level * 20}%</span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {data.languages.length > 0 && (
          <section className={`${styles.block} resume-section`}>
            <h3 className={styles.sectionHead}>{t("nutrition.vitamins")}</h3>
            <ul className={styles.vitamins}>
              {data.languages.map((lang) => (
                <li key={lang.id} className="language-badge">
                  {lang.name}{" "}
                  <b>
                    {lang.level === "native" ? t("nativeLanguage") : lang.level}
                  </b>
                </li>
              ))}
            </ul>
          </section>
        )}

        {data.experience.length > 0 && (
          <section className={`${styles.block} resume-section`}>
            <h3 className={styles.sectionHead}>{t("sections.experience")}</h3>
            {data.experience.map((exp) => {
              const lines = descriptionLines(exp.description);
              return (
                <article
                  key={exp.id}
                  className={`${styles.row} ${lines.length < 4 ? "resume-entry" : ""}`}
                >
                  <div className={styles.rowHead}>
                    <b>{exp.position}</b>
                    <span className={styles.rowDate}>
                      {range(exp.startDate, exp.endDate)}
                    </span>
                  </div>
                  <div className={styles.rowSub}>
                    {exp.company}
                    {exp.location ? ` · ${exp.location}` : ""}
                  </div>
                  {lines.length > 0 && (
                    <ul className={styles.rowText}>
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
            <h3 className={styles.sectionHead}>{t("sections.education")}</h3>
            {data.education.map((edu) => (
              <article key={edu.id} className={`${styles.row} resume-entry`}>
                <div className={styles.rowHead}>
                  <b>{edu.institution}</b>
                  <span className={styles.rowDate}>
                    {range(edu.startDate, edu.endDate)}
                  </span>
                </div>
                <div className={styles.rowSub}>
                  {edu.degree}
                  {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ""}
                </div>
                {edu.description && (
                  <p className={styles.rowText}>{edu.description}</p>
                )}
              </article>
            ))}
          </section>
        )}

        <p className={styles.footnote}>* {t("nutrition.footnote")}</p>
      </div>
    </div>
  );
}
