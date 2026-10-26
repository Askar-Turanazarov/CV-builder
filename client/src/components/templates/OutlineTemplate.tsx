import type { ReactNode } from "react";
import type { ResumeTemplateProps } from "../../types/resume";
import ContactLinks from "./shared/ContactLinks";
import Photo from "./shared/Photo";
import {
  descriptionLines,
  longestWordStyle,
  useTemplateKit,
} from "./shared/templateKit";
import styles from "./OutlineTemplate.module.css";

function Part({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`${styles.part} ${className ?? ""} resume-section`}>
      <h3 className={styles.heading}>{title}</h3>
      {children}
    </section>
  );
}

// Outline type: the surname and every section title are set huge and hollow,
// one accent colour, everything else quiet and precise.
export default function OutlineTemplate({ data }: ResumeTemplateProps) {
  const { t, range, birthDate, contactVariant, summary, strengths } =
    useTemplateKit(data);
  const { fullName, jobTitle } = data.personalInfo;
  const words = fullName.trim().split(/\s+/).filter(Boolean);
  const first = words.length > 1 ? words.slice(0, -1).join(" ") : "";
  const last = words.length ? words[words.length - 1] : "—";

  return (
    <div className={`${styles.page} resume-document`}>
      <header className={styles.header}>
        <div className={styles.headText} style={longestWordStyle(fullName)}>
          {jobTitle && <div className={styles.role}>{jobTitle}</div>}
          <h1 className={`${styles.name} resume-name`}>
            {first && <span className={styles.solid}>{first}</span>}
            <span className={styles.hollow}>{last}</span>
          </h1>
          {birthDate && <div className={styles.meta}>{birthDate}</div>}
        </div>
        <Photo data={data} className={styles.photo} />
      </header>

      <div className={styles.contacts}>
        <ContactLinks contacts={data.contacts} variant={contactVariant} />
      </div>

      {summary && (
        <Part title={t("sections.summary")}>
          <p className={styles.summary}>{summary}</p>
        </Part>
      )}

      {strengths.length > 0 && (
        <Part title={t("sections.strengths")}>
          <ol className={styles.strengths}>
            {strengths.map((strength, i) => (
              <li key={i}>
                <span className={styles.strengthNo}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{strength}</span>
              </li>
            ))}
          </ol>
        </Part>
      )}

      {data.experience.length > 0 && (
        <Part title={t("sections.experience")}>
          {data.experience.map((exp) => {
            const lines = descriptionLines(exp.description);
            return (
              // A long job may continue on the next page: print.css would
              // keep its body wrapper whole, so only short jobs are entries
              <article
                key={exp.id}
                className={`${styles.entry} ${lines.length < 4 ? "resume-entry" : ""}`}
              >
                <div className={styles.entryDate}>
                  {range(exp.startDate, exp.endDate)}
                </div>
                <div className={styles.entryBody}>
                  <div className={styles.entryTitle}>{exp.position}</div>
                  <div className={styles.entrySub}>
                    {exp.company}
                    {exp.location ? ` — ${exp.location}` : ""}
                  </div>
                  {lines.length > 0 && (
                    <ul className={styles.entryText}>
                      {lines.map((line, j) => (
                        <li key={j}>{line}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            );
          })}
        </Part>
      )}

      {data.education.length > 0 && (
        <Part title={t("sections.education")}>
          {data.education.map((edu) => (
            <article key={edu.id} className={`${styles.entry} resume-entry`}>
              <div className={styles.entryDate}>
                {range(edu.startDate, edu.endDate)}
              </div>
              <div className={styles.entryBody}>
                <div className={styles.entryTitle}>{edu.institution}</div>
                <div className={styles.entrySub}>
                  {edu.degree}
                  {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ""}
                </div>
                {edu.description && (
                  <p className={styles.entryText}>{edu.description}</p>
                )}
              </div>
            </article>
          ))}
        </Part>
      )}

      {(data.skills.length > 0 || data.languages.length > 0) && (
        <Part title={t("sections.skills")}>
          {data.skills.length > 0 && (
            <ul className={styles.skills}>
              {data.skills.map((skill) => (
                <li key={skill.id} className={`${styles.skill} skill-pill`}>
                  <span>{skill.name}</span>
                  {skill.level && (
                    <span className={styles.meter} aria-hidden="true">
                      <span style={{ width: `${skill.level * 20}%` }} />
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
          {data.languages.length > 0 && (
            <ul className={styles.langs} aria-label={t("sections.languages")}>
              {data.languages.map((lang) => (
                <li key={lang.id} className="language-badge">
                  <span className={styles.langLevel}>
                    {lang.level === "native" ? t("nativeLanguage") : lang.level}
                  </span>
                  {lang.name}
                </li>
              ))}
            </ul>
          )}
        </Part>
      )}
    </div>
  );
}
