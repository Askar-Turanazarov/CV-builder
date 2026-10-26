import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useResumeStore } from '../../store/resumeStore';
import { templateRegistry, type TemplateCategory } from '../templates/templateRegistry';
import { getSampleResume } from '../../data/sampleResume';
import { getResumeLanguage, type TemplateId } from '../../types/resume';
import SegmentedControl from '../common/SegmentedControl';
import TemplateThumbnail from './TemplateThumbnail';
import styles from './TemplateGalleryModal.module.css';

interface TemplateGalleryModalProps {
  onClose: () => void;
  /** Called after a template is picked (the store is already updated). */
  onSelect?: (id: TemplateId) => void;
}

export default function TemplateGalleryModal({ onClose, onSelect }: TemplateGalleryModalProps) {
  const { t } = useTranslation('common');
  const data = useResumeStore((s) => s.data);
  const setTemplate = useResumeStore((s) => s.setTemplate);
  const [tab, setTab] = useState<TemplateCategory>('popular');

  // Thumbnails always show a filled-in sample in the user's colours: with
  // the user's own (often still empty) resume every template looks blank.
  const sample = useMemo(
    () => getSampleResume(getResumeLanguage(data), { selectedThemeId: data.selectedThemeId, colorMode: data.colorMode }),
    [data.uiLanguage, data.resumeLanguage, data.selectedThemeId, data.colorMode],
  );
  const definitions = templateRegistry.filter((definition) => definition.category === tab);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const pick = (id: TemplateId) => {
    setTemplate(id);
    onClose();
    onSelect?.(id);
  };

  // Rendered via a portal straight into <body>: this modal must always cover
  // the true viewport. Rendering it inline would put it inside whatever
  // ancestor happens to have a CSS `backdrop-filter`/`filter`/`transform`
  // (e.g. the Glass skin's toolbar) — any of those properties make an
  // ancestor the containing block for `position: fixed` descendants, which
  // would squash this overlay into that small ancestor's box instead of the
  // full screen.
  return createPortal(
    <div className={`${styles.overlay} no-print`} onClick={onClose}>
      <div
        className={`${styles.modal} template-gallery`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={t('templateGallery.title')}
      >
        <div className={styles.header}>
          <div className={styles.heading}>
            <h2 className={styles.title}>{t('templateGallery.title')}</h2>
            <p className={styles.subtitle}>{t('templateGallery.subtitle', { count: templateRegistry.length })}</p>
          </div>
          <SegmentedControl<TemplateCategory>
            options={[
              { value: 'popular', label: t('templateGallery.popular') },
              { value: 'unusual', label: t('templateGallery.unusual') },
              { value: 'concept', label: t('templateGallery.concept') },
            ]}
            value={tab}
            onChange={setTab}
            ariaLabel={t('templateGallery.title')}
          />
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label={t('templateGallery.close')}>
            ×
          </button>
        </div>

        <div key={tab} className={`${styles.grid} stagger-in`}>
          {definitions.map((definition, index) => {
            const isActive = data.selectedTemplateId === definition.id;
            return (
              <button
                key={definition.id}
                type="button"
                className={`${styles.card} ${isActive ? styles.cardActive : ''}`}
                style={{ '--stagger-index': Math.min(index, 12) } as CSSProperties}
                onClick={() => pick(definition.id)}
              >
                <TemplateThumbnail data={{ ...sample, selectedTemplateId: definition.id }} />
                <span className={styles.cardLabel}>
                  {t(definition.labelKey)}
                  {isActive && <span className={styles.currentBadge}>{t('templateGallery.current')}</span>}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>,
    document.body,
  );
}
