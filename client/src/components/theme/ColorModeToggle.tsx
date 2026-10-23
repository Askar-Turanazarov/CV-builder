import { useTranslation } from 'react-i18next';
import { useResumeStore } from '../../store/resumeStore';
import styles from './ColorModeToggle.module.css';

/** Light/dark switch: a knob that slides between the sun and the moon. */
export default function ColorModeToggle() {
  const { t } = useTranslation('common');
  const colorMode = useResumeStore((s) => s.data.colorMode);
  const setColorMode = useResumeStore((s) => s.setColorMode);
  const isDark = colorMode === 'dark';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      className={`${styles.toggle} color-mode-toggle no-print`}
      data-mode={colorMode}
      onClick={() => setColorMode(isDark ? 'light' : 'dark')}
      aria-label={t('colorMode.label')}
      title={t(`colorMode.${isDark ? 'light' : 'dark'}`)}
    >
      <span className={styles.icon} aria-hidden="true">☀️</span>
      <span className={styles.icon} aria-hidden="true">🌙</span>
      <span className={styles.knob} aria-hidden="true" />
    </button>
  );
}
