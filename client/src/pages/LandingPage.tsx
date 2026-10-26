import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../components/common/Button';
import ShowcasePreviewModal from '../components/common/ShowcasePreviewModal';
import TemplateGalleryModal from '../components/theme/TemplateGalleryModal';
import ResumeTemplate from '../components/templates/ResumeTemplate';
import { getShowcaseResumes } from '../data/showcaseResumes';
import { useResumeStore } from '../store/resumeStore';
import type { ResumeData } from '../types/resume';
import styles from './LandingPage.module.css';

export default function LandingPage() {
  const { t } = useTranslation('common');
  const uiLanguage = useResumeStore((s) => s.data.uiLanguage);
  const showcaseResumes = useMemo(() => getShowcaseResumes(uiLanguage), [uiLanguage]);
  const [previewResume, setPreviewResume] = useState<ResumeData | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className={`${styles.heroCard} landing-card`}>
        <div className={styles.heroGrid}>
          <div className={styles.heroText}>
            <p className={styles.wordmark}>
              <span className={styles.wordmarkAccent}>CV</span> Forge
            </p>
            <h1 className={styles.title}>{t('landing.title')}</h1>
            <p className={styles.subtitle}>{t('landing.subtitle')}</p>
            <div className={styles.ctaRow}>
              <Link to="/editor">
                <Button className={styles.cta}>{t('landing.cta')}</Button>
              </Link>
              <Button variant="secondary" className={styles.cta} onClick={() => setIsGalleryOpen(true)}>
                🗂️ {t('landing.browseTemplates')}
              </Button>
            </div>

            <ul className={styles.features}>
              <li>✨ {t('landing.featureAi')}</li>
              <li>🎨 {t('landing.featureTemplates')}</li>
              <li>🖨️ {t('landing.featureExport')}</li>
            </ul>
          </div>

          <div className={styles.showcase}>
            {showcaseResumes.map((resume, index) => {
              return (
                <button
                  key={resume.selectedTemplateId}
                  type="button"
                  className={styles.showcaseCard}
                  style={{ animationDelay: `${150 + index * 90}ms` }}
                  onClick={() => setPreviewResume(resume)}
                  aria-label={t('landing.previewResume')}
                >
                  <div className={styles.previewFrame}>
                    <div
                      className={styles.previewScale}
                      data-theme={resume.selectedThemeId}
                      data-color-mode="light"
                    >
                      <ResumeTemplate data={resume} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {isGalleryOpen && (
        <TemplateGalleryModal onClose={() => setIsGalleryOpen(false)} onSelect={() => navigate('/editor')} />
      )}
      {previewResume && <ShowcasePreviewModal resume={previewResume} onClose={() => setPreviewResume(null)} />}
    </div>
  );
}
