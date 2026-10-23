import { useTranslation } from 'react-i18next';
import { useResumeStore } from '../../store/resumeStore';
import type { ViewMode } from '../../types/resume';
import SegmentedControl from '../common/SegmentedControl';
import styles from './TemplateSwitcher.module.css';

const MODES: ViewMode[] = ['document', 'site'];

export default function ViewModeToggle() {
  const { t } = useTranslation('common');
  const viewMode = useResumeStore((s) => s.data.viewMode);
  const setViewMode = useResumeStore((s) => s.setViewMode);

  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>{t('viewMode.label')}</span>
      <SegmentedControl
        options={MODES.map((mode) => ({ value: mode, label: t(`viewMode.${mode}`) }))}
        value={viewMode}
        onChange={setViewMode}
        ariaLabel={t('viewMode.label')}
      />
    </div>
  );
}
