import type { ResumeTemplateProps } from "../../types/resume";
import ContactLinks from "./shared/ContactLinks";
import Photo from "./shared/Photo";
import {
  careerYears,
  descriptionLines,
  initials,
  tenureMonths,
  useTemplateKit,
} from "./shared/templateKit";
import styles from "./CharacterSheetTemplate.module.css";

/** Skill level 1–5 as a tabletop ability score (4–20) and its modifier */
function ability(level: number) {
  const score = level * 4;
  const mod = Math.floor((score - 10) / 2);
  return { score, mod: mod >= 0 ? `+${mod}` : `${mod}` };
}

// The resume as a role-playing game character sheet: the role is the class,
// years of experience are the level, skills are ability scores, jobs are
// completed quests with their rewards, studies are academies.
export default function CharacterSheetTemplate({ data }: ResumeTemplateProps) {
  const { t, range, birthDate, contactVariant, summary, strengths } =
    useTemplateKit(data);
  const { fullName, jobTitle } = data.personalInfo;
  const level = careerYears(data);
  const xp = data.experience.reduce(
    (sum, exp) =>
      sum + tenureMonths(exp.startDate, exp.isCurrent ? null : exp.endDate),
    0,
  );
  const progress = ((xp % 12) / 12) * 100;

  return (
    <div className={`${styles.page} resume-document`}>
      <header className={styles.header}>
        <div className={styles.portrait}>
          <Photo
            data={data}
            className={styles.photo}
            fallback={initials(fullName)}
          />
          {level > 0 && (
            <div className={styles.level}>
              <span>{t("character.level")}</span>
              <strong>{level}</strong>
            </div>
          )}
        </div>
        <div className={styles.identity}>
          <div className={styles.kicker}>{t("character.sheet")}</div>
          <h1 className={`${styles.name} resume-name`}>{fullName || "—"}</h1>
          <dl className={styles.fields}>
            {jobTitle && (
              <div className={styles.field}>
                <dt>{t("character.class")}</dt>
                <dd>{jobTitle}</dd>
              </div>
            )}
            {birthDate && (
              <div className={styles.field}>
                <dt>{t("character.born")}</dt>
                <dd>{birthDate}</dd>
              </div>
            )}
          </dl>
          {xp > 0 && (
            <div className={styles.xp}>
              <span className={styles.xpLabel}>{t("character.xp")}</span>
              <span className={styles.xpBar}>
                <span
                  className={styles.xpFill}
                  style={{ width: `${Math.max(progress, 4)}%` }}
                />
              </span>
              <span className={styles.xpValue}>{xp} XP</span>
            </div>
          )}
          <ContactLinks
            contacts={data.contacts}
            variant={contactVariant}
            className={styles.contacts}
          />
        </div>
      </header>

      {summary && (
        <section className={`${styles.panel} resume-section`}>
          <h3 className={styles.panelHead}>{t("character.backstory")}</h3>
          <p className={styles.summary}>{summary}</p>
        </section>
      )}

      {data.skills.length > 0 && (
        <section className={`${styles.panel} resume-section`}>
          <h3 className={styles.panelHead}>{t("character.stats")}</h3>
          <ul className={styles.stats}>
            {data.skills.map((skill) => {
              const lvl = skill.level ?? 0;
              const { score, mod } = ability(lvl || 1);
              return (
                <li key={skill.id} className={`${styles.stat} skill-pill`}>
                  <span className={styles.statBox}>
                    <b>{lvl ? score : "—"}</b>
                    {lvl ? <small>{mod}</small> : null}
                  </span>
                  <span className={styles.statName}>{skill.name}</span>
                  {lvl ? (
                    <span className={styles.pips} aria-label={`${lvl}/5`}>
                      {[1, 2, 3, 4, 5].map((pip) => (
                        <span
                          key={pip}
                          className={pip <= lvl ? styles.pipOn : styles.pip}
                        />
                      ))}
                    </span>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {(strengths.length > 0 || data.languages.length > 0) && (
        <section className={`${styles.panel} resume-section`}>
          <h3 className={styles.panelHead}>{t("character.feats")}</h3>
          {strengths.length > 0 && (
            <ul className={styles.feats}>
              {strengths.map((strength, i) => (
                <li key={i}>{strength}</li>
              ))}
            </ul>
          )}
          {data.languages.length > 0 && (
            <div className={styles.tongues}>
              <span className={styles.tonguesLabel}>
                {t("character.tongues")}
              </span>
              {data.languages.map((lang) => (
                <span
                  key={lang.id}
                  className={`${styles.tongue} language-badge`}
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

      {data.experience.length > 0 && (
        <section className="resume-section">
          <h3 className={styles.sectionHead}>{t("character.quests")}</h3>
          {data.experience.map((exp) => {
            const lines = descriptionLines(exp.description);
            return (
              <article
                key={exp.id}
                className={`${styles.quest} ${lines.length < 4 ? "resume-entry" : ""}`}
              >
                <div className={styles.questHead}>
                  <span className={styles.questMark} aria-hidden="true">
                    {exp.isCurrent ? "◇" : "◆"}
                  </span>
                  <b className={styles.questTitle}>{exp.position}</b>
                  <span className={styles.questDate}>
                    {range(exp.startDate, exp.endDate)}
                  </span>
                </div>
                <div className={styles.questSub}>
                  {t("character.guild")}: {exp.company}
                  {exp.location ? ` · ${exp.location}` : ""}
                  {exp.isCurrent ? ` · ${t("character.active")}` : ""}
                </div>
                {lines.length > 0 && (
                  <>
                    <div className={styles.rewardsLabel}>
                      {t("character.rewards")}
                    </div>
                    <ul className={styles.rewards}>
                      {lines.map((line, j) => (
                        <li key={j}>{line}</li>
                      ))}
                    </ul>
                  </>
                )}
              </article>
            );
          })}
        </section>
      )}

      {data.education.length > 0 && (
        <section className="resume-section">
          <h3 className={styles.sectionHead}>{t("character.academies")}</h3>
          {data.education.map((edu) => (
            <article key={edu.id} className={`${styles.quest} resume-entry`}>
              <div className={styles.questHead}>
                <span className={styles.questMark} aria-hidden="true">
                  ✦
                </span>
                <b className={styles.questTitle}>{edu.institution}</b>
                <span className={styles.questDate}>
                  {range(edu.startDate, edu.endDate)}
                </span>
              </div>
              <div className={styles.questSub}>
                {edu.degree}
                {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ""}
              </div>
              {edu.description && (
                <p className={styles.eduText}>{edu.description}</p>
              )}
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
