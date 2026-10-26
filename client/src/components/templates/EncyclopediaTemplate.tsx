import type { ReactNode } from "react";
import type { ResumeTemplateProps } from "../../types/resume";
import ContactLinks from "./shared/ContactLinks";
import Photo from "./shared/Photo";
import { descriptionLines, useTemplateKit, yearOf } from "./shared/templateKit";
import styles from "./EncyclopediaTemplate.module.css";

// The resume as an encyclopedia article: a lead paragraph that starts with
// the name in bold, an infobox with the key facts, a numbered contents box,
// numbered sections and the skills as the article's category bar.
export default function EncyclopediaTemplate({ data }: ResumeTemplateProps) {
  const { t, range, birthDate, contactVariant, summary, strengths } =
    useTemplateKit(data);
  const { fullName, jobTitle } = data.personalInfo;
  const current =
    data.experience.find((exp) => exp.isCurrent) ?? data.experience[0];
  const firstYear = data.experience.length
    ? Math.min(...data.experience.map((exp) => Number(yearOf(exp.startDate))))
    : null;
  const latestStudy = data.education[0];

  const sections = [
    strengths.length > 0 && {
      key: "strengths",
      title: t("sections.strengths"),
      subs: [] as string[],
    },
    data.experience.length > 0 && {
      key: "experience",
      title: t("encyclopedia.career"),
      subs: data.experience.map((exp) => exp.company),
    },
    data.education.length > 0 && {
      key: "education",
      title: t("sections.education"),
      subs: [] as string[],
    },
    data.skills.length > 0 && {
      key: "skills",
      title: t("sections.skills"),
      subs: [] as string[],
    },
  ].filter(
    (section): section is { key: string; title: string; subs: string[] } =>
      Boolean(section),
  );
  const noOf = (key: string) =>
    sections.findIndex((section) => section.key === key) + 1;

  const facts: [string, ReactNode][] = [];
  if (birthDate) facts.push([t("encyclopedia.born"), birthDate]);
  if (jobTitle) facts.push([t("encyclopedia.occupation"), jobTitle]);
  if (firstYear)
    facts.push([
      t("encyclopedia.active"),
      `${firstYear} — ${t("encyclopedia.now")}`,
    ]);
  if (current) facts.push([t("encyclopedia.employer"), current.company]);
  if (latestStudy)
    facts.push([t("encyclopedia.alma"), latestStudy.institution]);
  if (data.languages.length > 0)
    facts.push([
      t("sections.languages"),
      data.languages
        .map(
          (lang) =>
            `${lang.name} (${lang.level === "native" ? t("nativeLanguage") : lang.level})`,
        )
        .join(", "),
    ]);

  return (
    <div className={`${styles.page} resume-document`}>
      <header className={styles.top}>
        <h1 className={`${styles.title} resume-name`}>{fullName || "—"}</h1>
        <div className={styles.from}>{t("encyclopedia.from")}</div>
      </header>

      <aside className={styles.infobox}>
        <div className={styles.infoName}>{fullName || "—"}</div>
        <Photo data={data} className={styles.photo} />
        {jobTitle && <div className={styles.caption}>{jobTitle}</div>}
        <table className={styles.facts}>
          <tbody>
            {facts.map(([label, value]) => (
              <tr key={label}>
                <th>{label}</th>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={styles.infoSub}>{t("sections.contacts")}</div>
        <ContactLinks
          contacts={data.contacts}
          variant={contactVariant}
          className={styles.contacts}
        />
      </aside>

      <p className={`${styles.lead} resume-section`}>
        <b>{fullName || "—"}</b>
        {jobTitle && (
          <> — {jobTitle.charAt(0).toLowerCase() + jobTitle.slice(1)}.</>
        )}{" "}
        {summary}
      </p>

      {sections.length > 1 && (
        <nav className={styles.toc} aria-label={t("encyclopedia.contents")}>
          <div className={styles.tocTitle}>{t("encyclopedia.contents")}</div>
          <ol>
            {sections.map((section, i) => (
              <li key={section.key}>
                <span className={styles.tocNo}>{i + 1}</span> {section.title}
                {section.subs.length > 0 && (
                  <ol>
                    {section.subs.map((sub, j) => (
                      <li key={j}>
                        <span className={styles.tocNo}>
                          {i + 1}.{j + 1}
                        </span>{" "}
                        {sub}
                      </li>
                    ))}
                  </ol>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      {strengths.length > 0 && (
        <section className={`${styles.section} resume-section`}>
          <h2 className={styles.h2}>{t("sections.strengths")}</h2>
          <ul className={styles.list}>
            {strengths.map((strength, i) => (
              <li key={i}>{strength}</li>
            ))}
          </ul>
        </section>
      )}

      {data.experience.length > 0 && (
        <section className={`${styles.section} resume-section`}>
          <h2 className={styles.h2}>{t("encyclopedia.career")}</h2>
          {data.experience.map((exp, i) => {
            const lines = descriptionLines(exp.description);
            return (
              <article
                key={exp.id}
                className={`${styles.sub} ${lines.length < 4 ? "resume-entry" : ""}`}
              >
                <h3 className={styles.h3}>
                  <span className={styles.subNo}>
                    {noOf("experience")}.{i + 1}
                  </span>{" "}
                  {exp.company}{" "}
                  <span className={styles.years}>
                    ({range(exp.startDate, exp.endDate)})
                  </span>
                </h3>
                <p className={styles.subLead}>
                  <i>{exp.position}</i>
                  {exp.location ? `, ${exp.location}` : ""}
                </p>
                {lines.length > 0 && (
                  <ul className={styles.list}>
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
        <section className={`${styles.section} resume-section`}>
          <h2 className={styles.h2}>{t("sections.education")}</h2>
          <ul className={styles.list}>
            {data.education.map((edu) => (
              <li key={edu.id} className="resume-entry">
                <b>{edu.institution}</b> ({range(edu.startDate, edu.endDate)}) —{" "}
                {edu.degree}
                {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ""}.
                {edu.description ? ` ${edu.description}` : ""}
              </li>
            ))}
          </ul>
        </section>
      )}

      {data.skills.length > 0 && (
        <section className={`${styles.categories} resume-section`}>
          <h2 className={styles.catLabel}>{t("encyclopedia.categories")}:</h2>
          <ul>
            {data.skills.map((skill) => (
              <li key={skill.id} className="skill-pill">
                {skill.name}
                {skill.level ? (
                  <sup className={styles.level}>{skill.level}/5</sup>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
