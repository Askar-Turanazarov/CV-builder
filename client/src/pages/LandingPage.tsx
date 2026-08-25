import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../components/common/Button';
import styles from './LandingPage.module.css';

export default function LandingPage() {
  const { t } = useTranslation('common');

  return (
    <div className={`container ${styles.wrapper}`}>
      <div className="landing-card">
        <h1 className={styles.title}>{t('landing.title')}</h1>
        <p className={styles.subtitle}>{t('landing.subtitle')}</p>
        <Link to="/editor">
          <Button>{t('landing.cta')}</Button>
        </Link>

        <ul className={styles.features}>
          <li>✨ {t('landing.featureAi')}</li>
          <li>🎨 {t('landing.featureTemplates')}</li>
          <li>🖨️ {t('landing.featureExport')}</li>
        </ul>
      </div>
    </div>
  );
}
