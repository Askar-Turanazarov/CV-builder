import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ResumeData } from '../../types/resume';
import { computeJobMatch, type JobMatchResult } from '../../lib/jobMatch';
import styles from './ResumeInsightsPanel.module.css';

interface JobMatchCardProps {
  data: ResumeData;
}

// Paste-a-job-description keyword check — a plain word-overlap heuristic
// (see lib/jobMatch.ts), not a real ATS/semantic analysis, but still the
// single most commonly requested feature across resume-builder products.
// Kept as its own component (rather than inline in ResumeInsightsPanel)
// because it owns its own textarea/button local state.
export default function JobMatchCard({ data }: JobMatchCardProps) {
  const { t } = useTranslation('insights');
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState<JobMatchResult | null | undefined>(undefined);

  const handleCheck = () => {
    setResult(computeJobMatch(jobDescription, data));
  };

  return (
    <section className={`${styles.card} insights-card`}>
      <h2 className={styles.title}>{t('jobMatch.title')}</h2>
      <textarea
        className={styles.jobMatchInput}
        placeholder={t('jobMatch.placeholder')}
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        rows={5}
      />
      <button type="button" className={styles.fixButton} onClick={handleCheck} disabled={jobDescription.trim() === ''}>
        {t('jobMatch.button')}
      </button>

      {result && (
        <div className={styles.jobMatchResult}>
          <p className={styles.jobMatchScore}>{t('jobMatch.resultLabel', { percent: result.percent })}</p>
          {result.missingKeywords.length > 0 ? (
            <>
              <p className={styles.jobMatchHint}>{t('jobMatch.missingTitle')}</p>
              <ul className={styles.jobMatchKeywords}>
                {result.missingKeywords.map((keyword) => (
                  <li key={keyword} className={styles.jobMatchKeyword}>
                    {keyword}
                  </li>
                ))}
              </ul>
              <p className={styles.jobMatchHint}>{t('jobMatch.missingHint')}</p>
            </>
          ) : (
            <p className={styles.jobMatchHint}>{t('jobMatch.noMissing')}</p>
          )}
          <p className={styles.jobMatchDisclaimer}>{t('jobMatch.disclaimer')}</p>
        </div>
      )}
    </section>
  );
}
