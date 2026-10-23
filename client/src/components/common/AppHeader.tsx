import { useEffect, useLayoutEffect, useRef, useState } from 'react';
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

// Hysteresis: collapse a bit further down than where it expands again, so a
// page resting near the threshold doesn't flicker between the two states.
const COLLAPSE_AT = 72;
const EXPAND_AT = 24;

/**
 * Mobile header behaviour: expanded at the top of the page, compact once the
 * user scrolls (controls tucked away behind a settings button). The header is
 * fixed on mobile with a spacer of its *expanded* height underneath, so the
 * collapse happens inside the glass and the page content never shifts.
 */
function useCollapsingHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [expandedHeight, setExpandedHeight] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setCollapsed((prev) => (prev ? y > EXPAND_AT : y > COLLAPSE_AT));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Only the expanded height is worth reserving; measured while expanded.
  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header || collapsed) return;
    const update = () => setExpandedHeight(header.offsetHeight);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(header);
    return () => observer.disconnect();
  }, [collapsed]);

  // The settings panel only exists in the collapsed state; close it when the
  // user scrolls back to the top, and on any tap outside the header.
  useEffect(() => {
    if (!collapsed) setPanelOpen(false);
  }, [collapsed]);

  useEffect(() => {
    if (!panelOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setPanelOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [panelOpen]);

  return { headerRef, collapsed, panelOpen, setPanelOpen, expandedHeight };
}

export default function AppHeader() {
  const { t } = useTranslation('common');
  const { pathname } = useLocation();
  const [brandFirstWord, ...brandRest] = t('appName').split(' ');
  // Re-measure on route and language change (labels change width).
  const nav = useSlidingIndicator<HTMLElement>(`${pathname}|${t('nav.editor')}`);
  const { headerRef, collapsed, panelOpen, setPanelOpen, expandedHeight } = useCollapsingHeader();

  useEffect(() => setPanelOpen(false), [pathname, setPanelOpen]);

  return (
    <>
    <header
      ref={headerRef}
      className={`${styles.header} app-header no-print`}
      data-collapsed={collapsed || undefined}
      data-panel-open={panelOpen || undefined}
    >
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.brand}>
          <span>
            <span className={styles.brandAccent}>{brandFirstWord}</span> {brandRest.join(' ')}
          </span>
          <span className={styles.byline}>by Askar</span>
        </Link>
        <button
          type="button"
          className={styles.settingsButton}
          onClick={() => setPanelOpen((open) => !open)}
          aria-expanded={panelOpen}
          aria-label={t(panelOpen ? 'settings.close' : 'settings.open')}
          tabIndex={collapsed ? 0 : -1}
        >
          <span aria-hidden="true">{panelOpen ? '✕' : '⚙️'}</span>
        </button>
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
          <div className={styles.controlsInner}>
            <ColorModeToggle />
            <DesignSystemToggle />
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
    <div className={styles.headerSpacer} style={{ height: expandedHeight }} aria-hidden="true" />
    </>
  );
}
