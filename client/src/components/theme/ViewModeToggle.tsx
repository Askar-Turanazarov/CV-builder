import { useTranslation } from 'react-i18next';
import { useResumeStore } from '../../store/resumeStore';
import styles from './TemplateSwitcher.module.css';

const MODES = ['document', 'site'] as const;

export default function ViewModeToggle() {
  const { t } = useTranslation('common');
  const viewMode = useResumeStore((s) => s.data.viewMode);
  const setViewMode = useResumeStore((s) => s.setViewMode);

  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>{t('viewMode.label')}</span>
      <div className={styles.optionRow}>
        {MODES.map((mode) => (
          <button
            key={mode}
            type="button"
            className={`${styles.option} ${viewMode === mode ? styles.active : ''}`}
            onClick={() => setViewMode(mode)}
            aria-pressed={viewMode === mode}
          >
            {t(`viewMode.${mode}`)}
          </button>
        ))}
      </div>
    </div>
  );
}
