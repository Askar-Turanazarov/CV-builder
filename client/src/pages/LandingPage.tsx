import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../components/common/Button';
import { getTemplateComponent } from '../components/templates/templateRegistry';
import { showcaseResumes } from '../data/showcaseResumes';
import styles from './LandingPage.module.css';

export default function LandingPage() {
  const { t } = useTranslation('common');

  return (
    <div className={styles.hero}>
      <div className={`${styles.heroCard} landing-card`}>
        <div className={styles.heroGrid}>
          <div className={styles.heroText}>
            <span className={styles.badge}>✨ {t('appName')}</span>
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

          <div className={styles.showcase} aria-hidden="true">
            {showcaseResumes.map((resume) => {
              const TemplateComponent = getTemplateComponent(resume.selectedTemplateId);
              return (
                <div key={resume.selectedTemplateId} className={styles.showcaseCard}>
                  <div className={styles.previewFrame}>
                    <div
                      className={styles.previewScale}
                      data-theme={resume.selectedThemeId}
                      data-color-mode="light"
                    >
                      <TemplateComponent data={resume} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
