import { useTranslation } from 'react-i18next';
import { useResumeStore } from '../../store/resumeStore';
import type { UiLanguage } from '../../types/resume';
import SegmentedControl from '../common/SegmentedControl';
import styles from './TemplateSwitcher.module.css';

type Choice = 'auto' | UiLanguage;
const CHOICES: Choice[] = ['auto', 'ru', 'en', 'uz'];

/**
 * Language of the resume itself (headings, dates), e.g. an English resume
 * for a foreign employer while the site stays in Russian. Defaults to the
 * interface language.
 */
export default function ResumeLanguageToggle() {
  const { t } = useTranslation('common');
  const resumeLanguage = useResumeStore((s) => s.data.resumeLanguage);
  const uiLanguage = useResumeStore((s) => s.data.uiLanguage);
  const setResumeLanguage = useResumeStore((s) => s.setResumeLanguage);
  const value: Choice = resumeLanguage ?? 'auto';

  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>{t('resumeLanguage.label')}</span>
      <SegmentedControl
        options={CHOICES.map((choice) => ({
          value: choice,
          label: choice === 'auto' ? t('resumeLanguage.auto') : choice.toUpperCase(),
        }))}
        value={value}
        onChange={(choice) => setResumeLanguage(choice === 'auto' ? null : choice)}
        ariaLabel={t('resumeLanguage.label')}
      />
      {resumeLanguage && resumeLanguage !== uiLanguage && (
        <span className={styles.label}>{t('resumeLanguage.hint')}</span>
      )}
    </div>
  );
}
