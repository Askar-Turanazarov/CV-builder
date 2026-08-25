import { useTranslation } from 'react-i18next';
import { useResumeStore } from '../../store/resumeStore';
import styles from './ColorModeToggle.module.css';

export default function ColorModeToggle() {
  const { t } = useTranslation('common');
  const colorMode = useResumeStore((s) => s.data.colorMode);
  const setColorMode = useResumeStore((s) => s.setColorMode);

  const toggle = () => setColorMode(colorMode === 'light' ? 'dark' : 'light');

  return (
    <button type="button" className={styles.toggle} onClick={toggle} aria-label={t('colorMode.label')}>
      <span aria-hidden="true">{colorMode === 'light' ? '☀️' : '🌙'}</span>
      {t(`colorMode.${colorMode}`)}
    </button>
  );
}
