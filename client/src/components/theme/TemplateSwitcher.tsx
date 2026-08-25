import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useResumeStore } from '../../store/resumeStore';
import { templateRegistry } from '../templates/templateRegistry';
import TemplateGalleryModal from './TemplateGalleryModal';
import styles from './TemplateSwitcher.module.css';

export default function TemplateSwitcher() {
  const { t } = useTranslation('common');
  const data = useResumeStore((s) => s.data);
  const [isOpen, setIsOpen] = useState(false);

  const current = templateRegistry.find((definition) => definition.id === data.selectedTemplateId);

  return (
    <>
      <button type="button" className={styles.trigger} onClick={() => setIsOpen(true)}>
        <span className={styles.triggerLabel}>{t('template.label')}:</span>
        <span>{current ? t(current.labelKey) : ''}</span>
        <span aria-hidden="true">▾</span>
      </button>
      {isOpen && <TemplateGalleryModal data={data} onClose={() => setIsOpen(false)} />}
    </>
  );
}
