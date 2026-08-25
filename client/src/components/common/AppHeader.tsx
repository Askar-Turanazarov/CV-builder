import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import DesignSystemToggle from '../theme/DesignSystemToggle';
import styles from './AppHeader.module.css';

export default function AppHeader() {
  const { t } = useTranslation('common');

  return (
    <header className={`${styles.header} app-header no-print`}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.brand}>
          {t('appName')}
        </Link>
        <nav className={`${styles.nav} pill-group`}>
          <NavLink to="/editor" className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}>
            {t('nav.editor')}
          </NavLink>
          <NavLink to="/preview" className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}>
            {t('nav.preview')}
          </NavLink>
        </nav>
        <div className={styles.controls}>
          <DesignSystemToggle />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
