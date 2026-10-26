import { useTranslation } from 'react-i18next';
import type { LanguageEntry } from '../../../types/resume';
import styles from './LanguageBadge.module.css';

export default function LanguageBadge({ language }: { language: LanguageEntry }) {
  const { t } = useTranslation('templates');
  return (
    <span className={`${styles.badge} language-badge`}>
      {language.name}
      <span className={styles.level}>{language.level === 'native' ? t('nativeLanguage') : language.level}</span>
    </span>
  );
}
