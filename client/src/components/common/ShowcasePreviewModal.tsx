import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { getTemplateComponent } from '../templates/templateRegistry';
import type { ResumeData } from '../../types/resume';
import styles from './ShowcasePreviewModal.module.css';

interface ShowcasePreviewModalProps {
  resume: ResumeData;
  onClose: () => void;
}

// A read-only "here's what it looks like full-size" lightbox for the
// landing page's showcase resumes — same portal/overlay pattern as
// TemplateGalleryModal, but simpler: one resume, no tabs, no picking.
export default function ShowcasePreviewModal({ resume, onClose }: ShowcasePreviewModalProps) {
  const { t } = useTranslation('common');
  const TemplateComponent = getTemplateComponent(resume.selectedTemplateId);

  return createPortal(
    <div className={`${styles.overlay} no-print`} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <button type="button" className={styles.closeButton} onClick={onClose} aria-label={t('templateGallery.close')}>
          ×
        </button>
        <div className={styles.scroll}>
          <div data-theme={resume.selectedThemeId} data-color-mode="light">
            <TemplateComponent data={resume} />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
