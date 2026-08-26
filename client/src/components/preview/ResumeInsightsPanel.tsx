import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useResumeStore } from '../../store/resumeStore';
import {
  getResumeChecklist,
  getResumeScore,
  estimateLengthVerdict,
  suggestTemplatesForRole,
  type ChecklistItem,
} from '../../lib/resumeInsights';
import { templateRegistry } from '../templates/templateRegistry';
import JobMatchCard from './JobMatchCard';
import styles from './ResumeInsightsPanel.module.css';

const RING_RADIUS = 26;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

/** Counts up from 0 to `target` once (on first mount) — later changes to
 * `target` (the panel updates live as the user edits elsewhere) just snap
 * to the new value instead of restarting the animation from zero. */
function useCountUp(target: number, duration = 700) {
  const [value, setValue] = useState(0);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (hasAnimatedRef.current) {
      setValue(target);
      return;
    }
    hasAnimatedRef.current = true;
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.round(target * progress));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}

// Fills the space next to the resume on wide screens with something
// actually useful instead of decoration — a completeness checklist (with
// one-click links to the relevant editor step), a rough page-length
// estimate, a job-description match check, and a template nudge based on
// the entered job title. Pure read + one store action (`setTemplate`);
// most of the actual logic lives in lib/resumeInsights.ts so it stays easy
// to reason about independently of this component's markup.
export default function ResumeInsightsPanel() {
  const { t } = useTranslation('insights');
  const { t: tCommon } = useTranslation('common');
  const data = useResumeStore((s) => s.data);
  const setTemplate = useResumeStore((s) => s.setTemplate);
  const navigate = useNavigate();

  const checklist = getResumeChecklist(data);
  const score = getResumeScore(checklist);
  const lengthVerdict = estimateLengthVerdict(data);
  const animatedPercent = useCountUp(score.percent);

  // Keeps a just-completed checklist item on screen for a moment (with a
  // `.completing` class driving the CSS transition) instead of having it
  // vanish the instant its data becomes valid.
  const [displayedPending, setDisplayedPending] = useState<ChecklistItem[]>(() => checklist.filter((item) => !item.done));
  const [completingKeys, setCompletingKeys] = useState<string[]>([]);
  const displayedPendingRef = useRef(displayedPending);
  displayedPendingRef.current = displayedPending;
  const checklistRef = useRef(checklist);
  checklistRef.current = checklist;
  const doneSignature = checklist.map((item) => (item.done ? '1' : '0')).join('');

  useEffect(() => {
    const list = checklistRef.current;
    const stillPendingKeys = new Set(list.filter((item) => !item.done).map((item) => item.key));
    const current = displayedPendingRef.current;
    const currentKeys = new Set(current.map((item) => item.key));

    const additions = list.filter((item) => !item.done && !currentKeys.has(item.key));
    if (additions.length > 0) {
      setDisplayedPending((prev) => [...prev, ...additions]);
    }

    const toComplete = current.filter((item) => !stillPendingKeys.has(item.key));
    if (toComplete.length === 0) return;

    const keys = toComplete.map((item) => item.key);
    setCompletingKeys((prev) => Array.from(new Set([...prev, ...keys])));
    const timer = setTimeout(() => {
      setDisplayedPending((prev) => prev.filter((item) => !keys.includes(item.key)));
      setCompletingKeys((prev) => prev.filter((key) => !keys.includes(key)));
    }, 300);
    return () => clearTimeout(timer);
  }, [doneSignature]);

  const suggestedTemplates = suggestTemplatesForRole(data.personalInfo.jobTitle, data.selectedTemplateId)
    .map((id) => templateRegistry.find((definition) => definition.id === id))
    .filter((definition): definition is NonNullable<typeof definition> => Boolean(definition));

  const goToStep = (stepKey: ChecklistItem['stepKey']) => {
    navigate('/editor', { state: { stepKey } });
  };

  return (
    <div className={styles.panel}>
      <section className={`${styles.card} insights-card`}>
        <h2 className={styles.title}>{t('panel.title')}</h2>

        <div className={styles.scoreRow}>
          <svg className={styles.scoreRing} viewBox="0 0 64 64" width="64" height="64">
            <circle className={styles.scoreRingTrack} cx="32" cy="32" r={RING_RADIUS} />
            <circle
              className={styles.scoreRingFill}
              cx="32"
              cy="32"
              r={RING_RADIUS}
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={RING_CIRCUMFERENCE * (1 - score.percent / 100)}
            />
            <text className={styles.scoreRingText} x="32" y="37" textAnchor="middle">
              {animatedPercent}%
            </text>
          </svg>
          <span className={styles.scoreLabel}>{t('panel.scoreLabel', { done: score.done, total: score.total })}</span>
        </div>

        {displayedPending.length === 0 ? (
          <p className={styles.allDone}>{t('panel.allDone')}</p>
        ) : (
          <ul className={styles.checklist}>
            {displayedPending.map((item) => (
              <li
                key={item.key}
                className={`${styles.checklistItem} ${completingKeys.includes(item.key) ? styles.completing : ''}`}
              >
                <div>
                  <p className={styles.checklistLabel}>{t(item.labelKey)}</p>
                  <p className={styles.checklistTip}>{t(item.tipKey)}</p>
                </div>
                <button type="button" className={styles.fixButton} onClick={() => goToStep(item.stepKey)}>
                  {t('panel.fixButton')}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={`${styles.card} insights-card`}>
        <h2 className={styles.title}>{t('length.title')}</h2>
        <p className={styles.lengthVerdict}>{t(`length.${lengthVerdict}`)}</p>
      </section>

      <JobMatchCard data={data} />

      {suggestedTemplates.length > 0 && (
        <section className={`${styles.card} insights-card`}>
          <h2 className={styles.title}>{t('templateSuggestion.title')}</h2>
          <ul className={styles.templateList}>
            {suggestedTemplates.map((definition) => (
              <li key={definition.id} className={styles.templateItem}>
                <span>{tCommon(definition.labelKey)}</span>
                <button type="button" className={styles.applyButton} onClick={() => setTemplate(definition.id)}>
                  {t('templateSuggestion.apply')}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
