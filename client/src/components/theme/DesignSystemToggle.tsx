import { useTranslation } from 'react-i18next';
import { useResumeStore } from '../../store/resumeStore';
import type { UiDesignSystem } from '../../types/resume';
import SegmentedControl from '../common/SegmentedControl';

const OPTIONS: UiDesignSystem[] = ['glass', 'classic'];

export default function DesignSystemToggle() {
  const { t } = useTranslation('common');
  const uiDesignSystem = useResumeStore((s) => s.data.uiDesignSystem);
  const setUiDesignSystem = useResumeStore((s) => s.setUiDesignSystem);

  return (
    <SegmentedControl
      options={OPTIONS.map((option) => ({ value: option, label: t(`design.${option}`) }))}
      value={uiDesignSystem}
      onChange={setUiDesignSystem}
      ariaLabel={t('design.label')}
    />
  );
}
