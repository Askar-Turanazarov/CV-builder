import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../components/common/Button';
import ShowcasePreviewModal from '../components/common/ShowcasePreviewModal';
import { getTemplateComponent } from '../components/templates/templateRegistry';
import { getShowcaseResumes } from '../data/showcaseResumes';
import { useResumeStore } from '../store/resumeStore';
import type { ResumeData } from '../types/resume';
import styles from './LandingPage.module.css';

export default function LandingPage() {
  const { t } = useTranslation('common');
  const uiLanguage = useResumeStore((s) => s.data.uiLanguage);
  const showcaseResumes = useMemo(() => getShowcaseResumes(uiLanguage), [uiLanguage]);
  const [previewResume, setPreviewResume] = useState<ResumeData | null>(null);

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
            <Link to="/editor">
              <Button className={styles.cta}>{t('landing.cta')}</Button>
            </Link>

            <ul className={styles.features}>
              <li>✨ {t('landing.featureAi')}</li>
              <li>🎨 {t('landing.featureTemplates')}</li>
              <li>🖨️ {t('landing.featureExport')}</li>
            </ul>
          </div>

          <div className={styles.showcase}>
            {showcaseResumes.map((resume) => {
              const TemplateComponent = getTemplateComponent(resume.selectedTemplateId);
              return (
                <button
                  key={resume.selectedTemplateId}
                  type="button"
                  className={styles.showcaseCard}
                  onClick={() => setPreviewResume(resume)}
                  aria-label={t('landing.previewResume')}
                >
                  <div className={styles.previewFrame}>
                    <div
                      className={styles.previewScale}
                      data-theme={resume.selectedThemeId}
                      data-color-mode="light"
                    >
                      <TemplateComponent data={resume} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {previewResume && <ShowcasePreviewModal resume={previewResume} onClose={() => setPreviewResume(null)} />}
    </div>
  );
}
