import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import DesignSystemToggle from '../theme/DesignSystemToggle';
import styles from './AppHeader.module.css';

export default function AppHeader() {
  const { t } = useTranslation('common');
  const [brandFirstWord, ...brandRest] = t('appName').split(' ');

  return (
    <header className={`${styles.header} app-header no-print`}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.brand}>
          <span className={styles.brandAccent}>{brandFirstWord}</span> {brandRest.join(' ')}
        </Link>
        <nav className={`${styles.nav} pill-group`}>
          <NavLink to="/resumes" className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}>
            {t('nav.resumes')}
          </NavLink>
          <NavLink to="/editor" className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}>
            {t('nav.editor')}
          </NavLink>
          <NavLink to="/preview" className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}>
            {t('nav.preview')}
          </NavLink>
          <NavLink to="/cover-letter" className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}>
            {t('nav.coverLetter')}
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
