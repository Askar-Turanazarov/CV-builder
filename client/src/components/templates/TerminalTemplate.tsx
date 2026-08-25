import { useTranslation } from 'react-i18next';
import type { ResumeTemplateProps } from '../../types/resume';
import { formatDateRange, formatFullDate } from './shared/dateFormat';
import SkillPill from './shared/SkillPill';
import LanguageBadge from './shared/LanguageBadge';
import ContactLinks from './shared/ContactLinks';
import styles from './TerminalTemplate.module.css';

// The whole resume styled as a dark terminal session: a fake window chrome,
// `$` shell prompts, green-on-black monospace throughout. Not for every
// recruiter — that's the point of the "unusual" category.
export default function TerminalTemplate({ data }: ResumeTemplateProps) {
  const { t } = useTranslation('templates');
  const present = t('present');

  return (
    <div className={`${styles.page} resume-document`}>
      <div className={styles.titleBar}>
        <span className={styles.dot} data-color="red" />
        <span className={styles.dot} data-color="yellow" />
        <span className={styles.dot} data-color="green" />
        <span className={styles.titleText}>guest@resume: ~</span>
      </div>

      <div className={styles.terminalBody}>
        <p className={styles.line}>
          <span className={styles.prompt}>$</span> whoami
        </p>
        <p className={styles.output}>
          <span className={`${styles.nameText} resume-name`}>{data.personalInfo.fullName || '—'}</span> — {data.personalInfo.jobTitle}
        </p>
        <ContactLinks
          contacts={data.contacts}
          variant={data.viewMode === 'site' ? 'buttons' : 'plain'}
          tone="inverted"
          className={styles.contactLinks}
        />
        {data.personalInfo.birthDate && (
          <p className={styles.output}>{formatFullDate(data.personalInfo.birthDate, data.uiLanguage)}</p>
        )}

        {data.aiContent?.summary && (
          <>
            <p className={styles.line}>
              <span className={styles.prompt}>$</span> cat about.md
            </p>
            <p className={styles.output}>{data.aiContent.summary}</p>
          </>
        )}

        {data.aiContent && data.aiContent.strengths.length > 0 && (
          <>
            <p className={styles.line}>
              <span className={styles.prompt}>$</span> ls strengths/
            </p>
            {data.aiContent.strengths.map((strength, index) => (
              <p key={index} className={styles.output}>
                - {strength}
              </p>
            ))}
          </>
        )}

        {data.experience.length > 0 && (
          <>
            <p className={styles.line}>
              <span className={styles.prompt}>$</span> git log --oneline experience
            </p>
            {data.experience.map((exp) => (
              <p key={exp.id} className={`${styles.output} resume-entry`}>
                <span className={styles.hash}>{formatDateRange(exp.startDate, exp.endDate, data.uiLanguage, present)}</span> {exp.position} @ {exp.company}
                {exp.description ? ` — ${exp.description}` : ''}
              </p>
            ))}
          </>
        )}

        {data.education.length > 0 && (
          <>
            <p className={styles.line}>
              <span className={styles.prompt}>$</span> cat education.txt
            </p>
            {data.education.map((edu) => (
              <p key={edu.id} className={`${styles.output} resume-entry`}>
                {edu.degree}
                {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''} — {edu.institution} (
                {formatDateRange(edu.startDate, edu.endDate, data.uiLanguage, present)})
              </p>
            ))}
          </>
        )}

        {data.skills.length > 0 && (
          <>
            <p className={styles.line}>
              <span className={styles.prompt}>$</span> npm list --depth=0
            </p>
            <div className={styles.pillRow}>
              {data.skills.map((skill) => (
                <SkillPill key={skill.id} skill={skill} />
              ))}
            </div>
          </>
        )}

        {data.languages.length > 0 && (
          <>
            <p className={styles.line}>
              <span className={styles.prompt}>$</span> locale -a
            </p>
            <div className={styles.pillRow}>
              {data.languages.map((lang) => (
                <LanguageBadge key={lang.id} language={lang} />
              ))}
            </div>
          </>
        )}

        <p className={styles.line}>
          <span className={styles.prompt}>$</span> <span className={styles.cursor}>▊</span>
        </p>
      </div>
    </div>
  );
}
