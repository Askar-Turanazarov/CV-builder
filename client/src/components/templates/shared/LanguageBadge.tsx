import type { LanguageEntry } from '../../../types/resume';
import styles from './LanguageBadge.module.css';

export default function LanguageBadge({ language }: { language: LanguageEntry }) {
  return (
    <span className={`${styles.badge} language-badge`}>
      {language.name}
      <span className={styles.level}>{language.level}</span>
    </span>
  );
}
