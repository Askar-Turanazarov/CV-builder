import { useTranslation } from 'react-i18next';
import { useResumeStore } from '../../store/resumeStore';
import type { UiLanguage } from '../../types/resume';
import styles from './LanguageSwitcher.module.css';

const LANGUAGES: UiLanguage[] = ['ru', 'en', 'uz'];

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation('common');
  const uiLanguage = useResumeStore((s) => s.data.uiLanguage);
  const setUiLanguage = useResumeStore((s) => s.setUiLanguage);

  const changeLanguage = (lang: UiLanguage) => {
    setUiLanguage(lang);
    void i18n.changeLanguage(lang);
  };

  return (
    <div className={`${styles.wrapper} no-print`} role="group" aria-label={t('language.label')}>
      {LANGUAGES.map((lang) => (
        <button
          key={lang}
          type="button"
          className={`${styles.option} ${uiLanguage === lang ? styles.active : ''}`}
          onClick={() => changeLanguage(lang)}
          aria-pressed={uiLanguage === lang}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
