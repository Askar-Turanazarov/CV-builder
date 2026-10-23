import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useResumeStore } from '../../store/resumeStore';
import type { UiLanguage } from '../../types/resume';
import SegmentedControl from './SegmentedControl';
import segmentedStyles from './SegmentedControl.module.css';

const LANGUAGES: UiLanguage[] = ['ru', 'en', 'uz'];
const HINT_KEY = 'cvforge:lang-hint-shown';

// Pulse the switcher once per browser session so first-time visitors notice
// the site speaks three languages.
function shouldShowHint(): boolean {
  try {
    if (sessionStorage.getItem(HINT_KEY)) return false;
    sessionStorage.setItem(HINT_KEY, '1');
    return true;
  } catch {
    return false;
  }
}

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation('common');
  const uiLanguage = useResumeStore((s) => s.data.uiLanguage);
  const setUiLanguage = useResumeStore((s) => s.setUiLanguage);
  const [hint] = useState(shouldShowHint);

  const changeLanguage = (lang: UiLanguage) => {
    setUiLanguage(lang);
    void i18n.changeLanguage(lang);
  };

  return (
    <SegmentedControl
      options={LANGUAGES.map((lang) => ({ value: lang, label: lang.toUpperCase() }))}
      value={uiLanguage}
      onChange={changeLanguage}
      ariaLabel={t('language.label')}
      className={hint ? segmentedStyles.hint : ''}
    />
  );
}
