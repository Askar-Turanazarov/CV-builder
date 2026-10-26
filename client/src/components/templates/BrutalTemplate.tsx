import type { ReactNode } from "react";
import type { ResumeTemplateProps } from "../../types/resume";
import ContactLinks from "./shared/ContactLinks";
import Photo from "./shared/Photo";
import {
  careerYears,
  descriptionLines,
  longestWordStyle,
  useTemplateKit,
  yearOf,
} from "./shared/templateKit";
import styles from "./BrutalTemplate.module.css";

function Block({
  no,
  title,
  children,
}: {
  no: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className={`${styles.block} resume-section`}>
      <h3 className={styles.heading}>
        <span className={styles.no}>{String(no).padStart(2, "0")}</span>
        <span>{title}</span>
      </h3>
      <div className={styles.body}>{children}</div>
    </section>
  );
}

// Brutalist poster: raw black rules, giant section numbers, the name on a
// solid accent slab and the career as a ruled table with a year column.
export default function BrutalTemplate({ data }: ResumeTemplateProps) {
  const { t, range, birthDate, contactVariant, summary, strengths } =
    useTemplateKit(data);
  const { fullName, jobTitle } = data.personalInfo;
  const years = careerYears(data);
  let no = 0;

  return (
    <div className={`${styles.page} resume-document`}>
      <header className={styles.header}>
        <div className={styles.slab}>
          <h1
            className={`${styles.name} resume-name`}
            style={longestWordStyle(fullName)}
          >
            {fullName || "—"}
          </h1>
          {jobTitle && <div className={styles.role}>{jobTitle}</div>}
        </div>
        <div className={styles.side}>
          <Photo data={data} className={styles.photo} />
          {years > 0 && (
            <div className={styles.years}>
              <strong>{years}</strong>
              <span>{t("deck.years", { count: years })}</span>
            </div>
          )}
        </div>
        <div className={styles.contacts}>
          <ContactLinks contacts={data.contacts} variant={contactVariant} />
          {birthDate && <span className={styles.meta}>{birthDate}</span>}
        </div>
      </header>

      {summary && (
        <Block no={++no} title={t("sections.summary")}>
          <p className={styles.summary}>{summary}</p>
        </Block>
      )}

      {strengths.length > 0 && (
        <Block no={++no} title={t("sections.strengths")}>
          <ol className={styles.strengths}>
            {strengths.map((strength, i) => (
              <li key={i}>{strength}</li>
            ))}
          </ol>
        </Block>
      )}

      {data.experience.length > 0 && (
        <Block no={++no} title={t("sections.experience")}>
          {data.experience.map((exp) => {
            const lines = descriptionLines(exp.description);
            return (
              // A long job may continue on the next page: print.css would
              // keep its body wrapper whole, so only short jobs are entries
              <article
                key={exp.id}
                className={`${styles.row} ${lines.length < 4 ? "resume-entry" : ""}`}
              >
                <div className={styles.year}>
                  {yearOf(exp.startDate)}
                  <span>{exp.isCurrent ? "→" : yearOf(exp.endDate)}</span>
                </div>
                <div>
                  <div className={styles.rowTitle}>{exp.position}</div>
                  <div className={styles.rowSub}>
                    {exp.company}
                    {exp.location ? ` / ${exp.location}` : ""} /{" "}
                    {range(exp.startDate, exp.endDate)}
                  </div>
                  {lines.length > 0 && (
                    <ul className={styles.rowText}>
                      {lines.map((line, j) => (
                        <li key={j}>{line}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            );
          })}
        </Block>
      )}

      {data.education.length > 0 && (
        <Block no={++no} title={t("sections.education")}>
          {data.education.map((edu) => (
            <article key={edu.id} className={`${styles.row} resume-entry`}>
              <div className={styles.year}>
                {yearOf(edu.startDate)}
                <span>{yearOf(edu.endDate)}</span>
              </div>
              <div>
                <div className={styles.rowTitle}>{edu.institution}</div>
                <div className={styles.rowSub}>
                  {edu.degree}
                  {edu.fieldOfStudy ? ` / ${edu.fieldOfStudy}` : ""}
                </div>
                {edu.description && (
                  <p className={styles.rowText}>{edu.description}</p>
                )}
              </div>
            </article>
          ))}
        </Block>
      )}

      {(data.skills.length > 0 || data.languages.length > 0) && (
        <Block
          no={++no}
          title={`${t("sections.skills")} / ${t("sections.languages")}`}
        >
          {data.skills.length > 0 && (
            <ul className={styles.tags}>
              {data.skills.map((skill) => (
                <li key={skill.id} className={`${styles.tag} skill-pill`}>
                  {skill.name}
                  {skill.level && (
                    <span className={styles.level}>{skill.level}/5</span>
                  )}
                </li>
              ))}
            </ul>
          )}
          {data.languages.length > 0 && (
            <ul className={styles.langs}>
              {data.languages.map((lang) => (
                <li key={lang.id} className="language-badge">
                  <strong>{lang.name}</strong>
                  {lang.level === "native" ? t("nativeLanguage") : lang.level}
                </li>
              ))}
            </ul>
          )}
        </Block>
      )}
    </div>
  );
}
