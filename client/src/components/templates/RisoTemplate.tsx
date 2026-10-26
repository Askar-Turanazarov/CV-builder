import type { CSSProperties } from "react";
import type { ResumeTemplateProps } from "../../types/resume";
import ContactLinks from "./shared/ContactLinks";
import LanguageBadge from "./shared/LanguageBadge";
import Photo from "./shared/Photo";
import {
  descriptionLines,
  initials,
  longestWordStyle,
  useTemplateKit,
} from "./shared/templateKit";
import styles from "./RisoTemplate.module.css";

/** Halftone field: solid dots shrinking from the corner (cheap to draw in a PDF) */
function Halftone({ className }: { className: string }) {
  const dots = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 16; col++) {
      const r = 5.2 - Math.hypot(col * 0.9, row * 1.1) * 0.36;
      if (r > 0.5)
        dots.push(
          <circle
            key={`${row}-${col}`}
            cx={250 - col * 16 - (row % 2) * 8}
            cy={6 + row * 14}
            r={r}
          />,
        );
    }
  }
  return (
    <svg className={className} viewBox="0 0 260 130" aria-hidden="true">
      {dots}
    </svg>
  );
}

/** A heading printed in two inks: a solid second-ink copy peeks out from behind */
function Misprint({
  text,
  as: Tag = "h3",
  className,
  style,
}: {
  text: string;
  as?: "h1" | "h3";
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <Tag
      className={`${styles.misprint} ${className ?? ""}`}
      data-text={text}
      style={style}
    >
      {text}
    </Tag>
  );
}

// Risograph zine: two inks (the theme colour and a warm second ink), slightly
// misregistered headings, a halftone dot field and cut-paper stickers.
export default function RisoTemplate({ data }: ResumeTemplateProps) {
  const { t, range, birthDate, contactVariant, summary, strengths } =
    useTemplateKit(data);
  const { fullName, jobTitle } = data.personalInfo;

  return (
    <div className={`${styles.page} resume-document`}>
      <header className={styles.header}>
        <Halftone className={styles.halftone} />
        <div className={styles.headText}>
          <div className={styles.issue}>{t("riso.issue")}</div>
          <Misprint
            text={fullName || "—"}
            as="h1"
            className={`${styles.name} resume-name`}
            style={longestWordStyle(fullName)}
          />
          {jobTitle && <div className={styles.role}>{jobTitle}</div>}
          {birthDate && <div className={styles.meta}>{birthDate}</div>}
        </div>
        <Photo
          data={data}
          className={styles.photo}
          fallback={initials(fullName)}
        />
      </header>

      <div className={styles.contacts}>
        <ContactLinks contacts={data.contacts} variant={contactVariant} />
      </div>

      {summary && (
        <section className={`${styles.block} resume-section`}>
          <Misprint text={t("sections.summary")} className={styles.heading} />
          <p className={styles.summary}>{summary}</p>
        </section>
      )}

      {strengths.length > 0 && (
        <section className={`${styles.block} resume-section`}>
          <Misprint text={t("sections.strengths")} className={styles.heading} />
          <ul className={styles.stickers}>
            {strengths.map((strength, i) => (
              <li key={i} className={styles.sticker}>
                {strength}
              </li>
            ))}
          </ul>
        </section>
      )}

      {data.experience.length > 0 && (
        <section className={`${styles.block} resume-section`}>
          <Misprint
            text={t("sections.experience")}
            className={styles.heading}
          />
          {data.experience.map((exp) => {
            const lines = descriptionLines(exp.description);
            return (
              <article key={exp.id} className={`${styles.job} resume-entry`}>
                <div className={styles.jobHead}>
                  <span className={styles.jobTitle}>{exp.position}</span>
                  <span className={styles.date}>
                    {range(exp.startDate, exp.endDate)}
                  </span>
                </div>
                <div className={styles.jobSub}>
                  {exp.company}
                  {exp.location ? ` · ${exp.location}` : ""}
                </div>
                {lines.length > 0 && (
                  <ul className={styles.jobText}>
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
          <Misprint text={t("sections.education")} className={styles.heading} />
          {data.education.map((edu) => (
            <article key={edu.id} className={`${styles.job} resume-entry`}>
              <div className={styles.date}>
                {range(edu.startDate, edu.endDate)}
              </div>
              <div className={styles.jobTitle}>{edu.institution}</div>
              <div className={styles.jobSub}>
                {edu.degree}
                {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ""}
              </div>
              {edu.description && (
                <p className={styles.jobText}>{edu.description}</p>
              )}
            </article>
          ))}
        </section>
      )}

      {(data.skills.length > 0 || data.languages.length > 0) && (
        <section className={`${styles.block} resume-section`}>
          <Misprint text={t("sections.skills")} className={styles.heading} />
          <ul className={styles.skills}>
            {data.skills.map((skill) => (
              <li key={skill.id} className={`${styles.skill} skill-pill`}>
                {skill.name}
                {skill.level && (
                  <span className={styles.dots} aria-hidden="true">
                    {"●".repeat(skill.level)}
                    <span>{"●".repeat(5 - skill.level)}</span>
                  </span>
                )}
              </li>
            ))}
          </ul>
          {data.languages.length > 0 && (
            <div className={styles.langs}>
              {data.languages.map((lang) => (
                <LanguageBadge key={lang.id} language={lang} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
