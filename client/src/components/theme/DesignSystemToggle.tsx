import { useTranslation } from 'react-i18next';
import { useResumeStore } from '../../store/resumeStore';
import type { UiDesignSystem } from '../../types/resume';
import styles from './DesignSystemToggle.module.css';

const OPTIONS: UiDesignSystem[] = ['classic', 'glass'];

export default function DesignSystemToggle() {
  const { t } = useTranslation('common');
  const uiDesignSystem = useResumeStore((s) => s.data.uiDesignSystem);
  const setUiDesignSystem = useResumeStore((s) => s.setUiDesignSystem);

  return (
    <div className={`${styles.wrapper} no-print`} role="group" aria-label={t('design.label')}>
      {OPTIONS.map((option) => (
        <button
          key={option}
          type="button"
          className={`${styles.option} ${uiDesignSystem === option ? styles.active : ''}`}
          onClick={() => setUiDesignSystem(option)}
          aria-pressed={uiDesignSystem === option}
        >
          {t(`design.${option}`)}
        </button>
      ))}
    </div>
  );
}
