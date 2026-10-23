import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './PdfProgressOverlay.module.css';

// The server can't report real progress (one request, one PDF), so the bar
// eases towards 90% on a curve and only completes when the file arrives.
const EASE_MS = 6_000;
const CAP = 90;
// After this long the user is probably hitting a serverless cold start.
const COLD_HINT_AFTER_MS = 4_000;
const FINISH_MS = 450;

interface PdfProgressOverlayProps {
  active: boolean;
}

export default function PdfProgressOverlay({ active }: PdfProgressOverlayProps) {
  const { t } = useTranslation('common');
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (active) {
      setVisible(true);
      setProgress(0);
      setElapsed(0);
      const startedAt = performance.now();
      const id = window.setInterval(() => {
        const ms = performance.now() - startedAt;
        setElapsed(ms);
        setProgress(CAP * (1 - Math.exp(-ms / EASE_MS)));
      }, 120);
      return () => window.clearInterval(id);
    }
    // Finished (or failed): fill the bar, then fade out.
    setProgress(100);
    const id = window.setTimeout(() => setVisible(false), FINISH_MS);
    return () => window.clearTimeout(id);
  }, [active]);

  if (!visible) return null;

  const stage =
    !active ? t('pdfProgress.done') : progress < 30 ? t('pdfProgress.launch') : progress < 70 ? t('pdfProgress.layout') : t('pdfProgress.finish');

  return (
    <div className={`${styles.overlay} no-print`} data-leaving={!active || undefined}>
      <div className={`${styles.card} pdf-progress-card`} role="status" aria-live="polite">
        <div className={styles.icon} aria-hidden="true">
          <span className={styles.sheet} />
          <span className={styles.sheet} />
        </div>
        <p className={styles.title}>{t('pdfProgress.title')}</p>
        <p className={styles.stage}>{stage}</p>
        <div className={styles.track} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}>
          <div className={styles.bar} style={{ width: `${progress}%` }} />
        </div>
        <p className={styles.hint} data-shown={active && elapsed > COLD_HINT_AFTER_MS ? true : undefined}>
          {t('pdfProgress.coldStartHint')}
        </p>
      </div>
    </div>
  );
}
