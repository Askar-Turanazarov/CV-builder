import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useResumeStore } from '../../store/resumeStore';
import { templateRegistry } from '../templates/templateRegistry';
import type { ResumeData } from '../../types/resume';
import styles from './TemplateGalleryModal.module.css';

interface TemplateGalleryModalProps {
  data: ResumeData;
  onClose: () => void;
}

export default function TemplateGalleryModal({ data, onClose }: TemplateGalleryModalProps) {
  const { t } = useTranslation('common');
  const setTemplate = useResumeStore((s) => s.setTemplate);
  const [tab, setTab] = useState<'popular' | 'unusual'>('popular');

  const definitions = templateRegistry.filter((definition) => definition.category === tab);

  // Rendered via a portal straight into <body>: this modal must always cover
  // the true viewport. Rendering it inline would put it inside whatever
  // ancestor happens to have a CSS `backdrop-filter`/`filter`/`transform`
  // (e.g. the Apple Glass skin's toolbar) — any of those properties make an
  // ancestor the containing block for `position: fixed` descendants, which
  // would squash this overlay into that small ancestor's box instead of the
  // full screen.
  return createPortal(
    <div className={`${styles.overlay} no-print`} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className={styles.header}>
          <div className={styles.tabs}>
            <button
              type="button"
              className={tab === 'popular' ? styles.tabActive : styles.tab}
              onClick={() => setTab('popular')}
            >
              {t('templateGallery.popular')}
            </button>
            <button
              type="button"
              className={tab === 'unusual' ? styles.tabActive : styles.tab}
              onClick={() => setTab('unusual')}
            >
              {t('templateGallery.unusual')}
            </button>
          </div>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label={t('templateGallery.close')}>
            ×
          </button>
        </div>

        <div className={styles.grid}>
          {definitions.map((definition) => {
            const TemplateComponent = definition.component;
            const isActive = data.selectedTemplateId === definition.id;
            return (
              <button
                key={definition.id}
                type="button"
                className={`${styles.card} ${isActive ? styles.cardActive : ''}`}
                onClick={() => {
                  setTemplate(definition.id);
                  onClose();
                }}
              >
                <div className={styles.previewFrame}>
                  <div
                    className={styles.previewScale}
                    data-theme={data.selectedThemeId}
                    data-color-mode={data.colorMode}
                  >
                    <TemplateComponent data={data} />
                  </div>
                </div>
                <span className={styles.cardLabel}>{t(definition.labelKey)}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>,
    document.body,
  );
}
