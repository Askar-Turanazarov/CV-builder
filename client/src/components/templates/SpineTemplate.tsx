import type { ReactNode } from "react";
import type { ResumeTemplateProps } from "../../types/resume";
import ContactLinks from "./shared/ContactLinks";
import Photo from "./shared/Photo";
import {
  descriptionLines,
  initials,
  useTemplateKit,
  yearOf,
} from "./shared/templateKit";
import styles from "./SpineTemplate.module.css";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

function Chapter({
  no,
  title,
  children,
}: {
  no: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className={`${styles.chapter} resume-section`}>
      <h3 className={styles.chapterTitle}>
        <span className={styles.chapterNo}>{ROMAN[no - 1]}</span>
        {title}
      </h3>
      {children}
    </section>
  );
}

// The resume as a book: a coloured spine with the name running along it, a
// title page with a table of contents, chapters numbered in Roman numerals
// and the skills as the book's alphabetical index.
export default function SpineTemplate({ data }: ResumeTemplateProps) {
  const { t, range, birthDate, contactVariant, summary, strengths } =
    useTemplateKit(data);
  const { fullName, jobTitle } = data.personalInfo;
  const firstYear = data.experience.length
    ? Math.min(...data.experience.map((exp) => Number(yearOf(exp.startDate))))
    : null;

  const chapters = [
    summary && t("sections.summary"),
    strengths.length > 0 && t("sections.strengths"),
    data.experience.length > 0 && t("sections.experience"),
    data.education.length > 0 && t("sections.education"),
    (data.skills.length > 0 || data.languages.length > 0) && t("spine.index"),
  ].filter((title): title is string => Boolean(title));
  const noOf = (title: string) => chapters.indexOf(title) + 1;
  const index = [...data.skills].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className={`${styles.page} resume-document`}>
      <div className={styles.book}>
        <div className={styles.spine} aria-hidden="true">
          <span className={styles.spineName}>{fullName}</span>
          <span className={styles.spineMark}>{initials(fullName)}</span>
        </div>

        <header className={styles.titlePage}>
          <div className={styles.publisher}>{t("spine.publisher")}</div>
          <div className={styles.titleRow}>
            <div className={styles.titleText}>
              <h1 className={`${styles.name} resume-name`}>
                {fullName || "—"}
              </h1>
              {jobTitle && <div className={styles.role}>{jobTitle}</div>}
              <div className={styles.edition}>
                {firstYear
                  ? t("spine.edition", {
                      from: firstYear,
                      to: new Date().getFullYear(),
                    })
                  : null}
                {birthDate && <span> · {birthDate}</span>}
              </div>
            </div>
            <Photo data={data} className={styles.photo} />
          </div>
          <div className={styles.contacts}>
            <ContactLinks contacts={data.contacts} variant={contactVariant} />
          </div>

          {chapters.length > 1 && (
            <nav className={styles.toc} aria-label={t("spine.contents")}>
              <div className={styles.tocTitle}>{t("spine.contents")}</div>
              <ol>
                {chapters.map((title, i) => (
                  <li key={title}>
                    <span className={styles.tocNo}>{ROMAN[i]}</span>
                    <span className={styles.tocName}>{title}</span>
                  </li>
                ))}
              </ol>
            </nav>
          )}
        </header>

        {summary && (
          <Chapter
            no={noOf(t("sections.summary"))}
            title={t("sections.summary")}
          >
            <p className={styles.prose}>{summary}</p>
          </Chapter>
        )}

        {strengths.length > 0 && (
          <Chapter
            no={noOf(t("sections.strengths"))}
            title={t("sections.strengths")}
          >
            <ul className={styles.theses}>
              {strengths.map((strength, i) => (
                <li key={i}>{strength}</li>
              ))}
            </ul>
          </Chapter>
        )}

        {data.experience.length > 0 && (
          <Chapter
            no={noOf(t("sections.experience"))}
            title={t("sections.experience")}
          >
            {data.experience.map((exp, i) => {
              const lines = descriptionLines(exp.description);
              return (
                <article
                  key={exp.id}
                  className={`${styles.entry} resume-entry`}
                >
                  <div className={styles.entryHead}>
                    <span className={styles.entryTitle}>
                      <span className={styles.para}>§ {i + 1}.</span>{" "}
                      {exp.position}
                    </span>
                    <span className={styles.entryDate}>
                      {range(exp.startDate, exp.endDate)}
                    </span>
                  </div>
                  <div className={styles.entrySub}>
                    {exp.company}
                    {exp.location ? `, ${exp.location}` : ""}
                  </div>
                  {lines.length > 0 && (
                    <ul className={styles.entryText}>
                      {lines.map((line, j) => (
                        <li key={j}>{line}</li>
                      ))}
                    </ul>
                  )}
                </article>
              );
            })}
          </Chapter>
        )}

        {data.education.length > 0 && (
          <Chapter
            no={noOf(t("sections.education"))}
            title={t("sections.education")}
          >
            {data.education.map((edu) => (
              <article key={edu.id} className={`${styles.entry} resume-entry`}>
                <div className={styles.entryHead}>
                  <span className={styles.entryTitle}>{edu.institution}</span>
                  <span className={styles.entryDate}>
                    {range(edu.startDate, edu.endDate)}
                  </span>
                </div>
                <div className={styles.entrySub}>
                  {edu.degree}
                  {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ""}
                </div>
                {edu.description && (
                  <p className={styles.entryText}>{edu.description}</p>
                )}
              </article>
            ))}
          </Chapter>
        )}

        {(data.skills.length > 0 || data.languages.length > 0) && (
          <Chapter no={noOf(t("spine.index"))} title={t("spine.index")}>
            {index.length > 0 && (
              <ul className={styles.index}>
                {index.map((skill) => (
                  <li
                    key={skill.id}
                    className={`${styles.indexItem} skill-pill`}
                  >
                    <span>{skill.name}</span>
                    {skill.level && (
                      <span className={styles.indexPage}>
                        {"★".repeat(skill.level)}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
            {data.languages.length > 0 && (
              <p className={styles.translations}>
                <span className={styles.translationsLabel}>
                  {t("spine.translations")}:
                </span>{" "}
                {data.languages
                  .map(
                    (lang) =>
                      `${lang.name} (${lang.level === "native" ? t("nativeLanguage") : lang.level})`,
                  )
                  .join(", ")}
              </p>
            )}
          </Chapter>
        )}
      </div>
    </div>
  );
}
