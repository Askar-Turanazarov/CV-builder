import { useTranslation } from 'react-i18next';
import { useResumeStore } from '../../store/resumeStore';
import { THEME_IDS, THEME_SWATCH } from './themes';
import styles from './ThemeSwitcher.module.css';

export default function ThemeSwitcher() {
  const { t } = useTranslation('common');
  const selectedThemeId = useResumeStore((s) => s.data.selectedThemeId);
  const setTheme = useResumeStore((s) => s.setTheme);

  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>{t('theme.label')}</span>
      <div className={styles.swatchRow}>
        {THEME_IDS.map((id) => (
          <button
            key={id}
            type="button"
            className={`${styles.swatch} ${selectedThemeId === id ? styles.active : ''}`}
            style={{ background: THEME_SWATCH[id] }}
            onClick={() => setTheme(id)}
            aria-pressed={selectedThemeId === id}
            title={t(`theme.${id}`)}
          >
            <span className="visually-hidden">{t(`theme.${id}`)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
