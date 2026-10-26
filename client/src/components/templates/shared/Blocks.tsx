import type { ResumeData } from '../../../types/resume';
import { descriptionLines, useTemplateKit } from './templateKit';

/**
 * Plain building blocks for templates whose look comes from layout and CSS
 * rather than from a different story: every part takes its class from the
 * template's own module, so the same markup can look like a magazine, a
 * letterhead or a slide deck. Entries carry `resume-entry` so print.css keeps
 * each one whole.
 */
export interface EntryClasses {
  list?: string;
  entry?: string;
  head?: string;
  title?: string;
  date?: string;
  sub?: string;
  text?: string;
  bullets?: string;
}

const join = (...names: (string | undefined | false)[]) => names.filter(Boolean).join(' ');

export function ExperienceEntries({ data, cls = {} }: { data: ResumeData; cls?: EntryClasses }) {
  const { range } = useTemplateKit(data);
  return (
    <div className={cls.list}>
      {data.experience.map((exp) => {
        const lines = descriptionLines(exp.description);
        return (
          <div key={exp.id} className={join(cls.entry, 'resume-entry')}>
            <div className={cls.head}>
              <span className={cls.title}>{exp.position}</span>
              <span className={cls.date}>{range(exp.startDate, exp.endDate)}</span>
            </div>
            <div className={cls.sub}>
              {exp.company}
              {exp.location ? ` · ${exp.location}` : ''}
            </div>
            {lines.length > 1 ? (
              <ul className={cls.bullets}>
                {lines.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            ) : (
              lines.length === 1 && <p className={cls.text}>{lines[0]}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function EducationEntries({ data, cls = {} }: { data: ResumeData; cls?: EntryClasses }) {
  const { range } = useTemplateKit(data);
  return (
    <div className={cls.list}>
      {data.education.map((edu) => (
        <div key={edu.id} className={join(cls.entry, 'resume-entry')}>
          <div className={cls.head}>
            <span className={cls.title}>{edu.institution}</span>
            <span className={cls.date}>{range(edu.startDate, edu.endDate)}</span>
          </div>
          <div className={cls.sub}>
            {edu.degree}
            {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}
          </div>
          {edu.description && <p className={cls.text}>{edu.description}</p>}
        </div>
      ))}
    </div>
  );
}

export interface ItemClasses {
  list?: string;
  item?: string;
  level?: string;
}

/** Skills as a list; the level is drawn with `mark` repeated (or as dots when no mark) */
export function SkillItems({ data, cls = {}, mark = '●' }: { data: ResumeData; cls?: ItemClasses; mark?: string }) {
  return (
    <ul className={cls.list}>
      {data.skills.map((skill) => (
        <li key={skill.id} className={join(cls.item, 'skill-pill')}>
          <span>{skill.name}</span>
          {skill.level && (
            <span className={cls.level} aria-label={`${skill.level}/5`}>
              {mark.repeat(skill.level)}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

export function LanguageItems({ data, cls = {} }: { data: ResumeData; cls?: ItemClasses }) {
  const { t } = useTemplateKit(data);
  return (
    <ul className={cls.list}>
      {data.languages.map((lang) => (
        <li key={lang.id} className={join(cls.item, 'language-badge')}>
          <span>{lang.name}</span>
          <span className={cls.level}>{lang.level === 'native' ? t('nativeLanguage') : lang.level}</span>
        </li>
      ))}
    </ul>
  );
}

export function StrengthItems({ data, className }: { data: ResumeData; className?: string }) {
  const { strengths } = useTemplateKit(data);
  return (
    <ul className={className}>
      {strengths.map((strength, i) => (
        <li key={i}>{strength}</li>
      ))}
    </ul>
  );
}
