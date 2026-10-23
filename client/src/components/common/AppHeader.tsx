import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import DesignSystemToggle from '../theme/DesignSystemToggle';
import ColorModeToggle from '../theme/ColorModeToggle';
import { useSlidingIndicator } from '../../hooks/useSlidingIndicator';
import segmented from './SegmentedControl.module.css';
import styles from './AppHeader.module.css';

const NAV_ITEMS = [
  { to: '/resumes', key: 'nav.resumes' },
  { to: '/editor', key: 'nav.editor' },
  { to: '/preview', key: 'nav.preview' },
  { to: '/cover-letter', key: 'nav.coverLetter' },
] as const;

export default function AppHeader() {
  const { t } = useTranslation('common');
  const { pathname } = useLocation();
  const [brandFirstWord, ...brandRest] = t('appName').split(' ');
  // Re-measure on route and language change (labels change width).
  const nav = useSlidingIndicator<HTMLElement>(`${pathname}|${t('nav.editor')}`);

  return (
    <header className={`${styles.header} app-header no-print`}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.brand}>
          <span>
            <span className={styles.brandAccent}>{brandFirstWord}</span> {brandRest.join(' ')}
          </span>
          <span className={styles.byline}>by Askar</span>
        </Link>
        <nav
          ref={nav.containerRef}
          className={`${styles.nav} ${segmented.group} segmented`}
          data-ready={nav.ready || undefined}
        >
          <span className={`${segmented.indicator} segmented-indicator`} style={nav.indicatorStyle} aria-hidden="true" />
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} className={`${segmented.item} ${styles.navItem} segmented-item`}>
              {t(item.key)}
            </NavLink>
          ))}
        </nav>
        <div className={styles.controls}>
          <ColorModeToggle />
          <DesignSystemToggle />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
