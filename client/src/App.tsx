import { useEffect, useRef } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useResumeStore } from './store/resumeStore';
import AppHeader from './components/common/AppHeader';
import AppFooter from './components/common/AppFooter';
import LandingPage from './pages/LandingPage';
import EditorPage from './pages/EditorPage';
import PreviewPage from './pages/PreviewPage';
import ResumesPage from './pages/ResumesPage';
import CoverLetterPage from './pages/CoverLetterPage';
import PrintPreviewPage from './pages/PrintPreviewPage';
import PrintCoverLetterPage from './pages/PrintCoverLetterPage';
import type { UiLanguage } from './types/resume';

const SUPPORTED_LANGUAGES: UiLanguage[] = ['ru', 'en', 'uz'];
const STORAGE_KEY = 'resume-builder:v1';

function readUrlLanguage(): UiLanguage | null {
  const lang = new URLSearchParams(window.location.search).get('lang') as UiLanguage | null;
  return lang && SUPPORTED_LANGUAGES.includes(lang) ? lang : null;
}

export default function App() {
  const location = useLocation();
  const isPrintRoute = location.pathname.startsWith('/print/');
  const { i18n } = useTranslation();
  const uiLanguage = useResumeStore((s) => s.data.uiLanguage);
  const setUiLanguage = useResumeStore((s) => s.setUiLanguage);

  const navigate = useNavigate();
  // Read once: the URL is rewritten below, and StrictMode re-runs effects
  const urlLanguage = useRef(readUrlLanguage());

  useEffect(() => {
    // A shared link with ?lang=en|uz wins. First-ever visit: adopt the
    // browser-detected language as the default. Returning visitor:
    // resumeStore's persisted uiLanguage is the source of truth, so just
    // sync i18next to it.
    // The headless print page has no visitor: its language comes with the data
    if (isPrintRoute) return;
    const urlLang = urlLanguage.current;
    const hasPersisted = localStorage.getItem(STORAGE_KEY) !== null;
    if (urlLang) {
      setUiLanguage(urlLang);
      void i18n.changeLanguage(urlLang);
    } else if (hasPersisted) {
      void i18n.changeLanguage(uiLanguage);
    } else {
      const detected = i18n.language?.split('-')[0] as UiLanguage;
      const lang = SUPPORTED_LANGUAGES.includes(detected) ? detected : 'ru';
      setUiLanguage(lang);
      void i18n.changeLanguage(lang);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the address shareable: Russian is the default and has no parameter,
  // other languages get ?lang=xx (also picked up by link previews, see vercel.json).
  useEffect(() => {
    if (isPrintRoute) return;
    // Until the store has picked up a ?lang from the link, leave the URL alone
    if (urlLanguage.current && urlLanguage.current !== uiLanguage) return;
    urlLanguage.current = null;
    document.documentElement.lang = uiLanguage;
    const params = new URLSearchParams(location.search);
    const wanted = uiLanguage === 'ru' ? null : uiLanguage;
    if (params.get('lang') === wanted) return;
    if (wanted) params.set('lang', wanted);
    else params.delete('lang');
    const search = params.toString();
    navigate({ pathname: location.pathname, search: search ? `?${search}` : '', hash: location.hash }, { replace: true });
  }, [uiLanguage, location.pathname, location.search, location.hash, isPrintRoute, navigate]);

  const uiDesignSystem = useResumeStore((s) => s.data.uiDesignSystem);
  const colorMode = useResumeStore((s) => s.data.colorMode);
  const themeId = useResumeStore((s) => s.data.selectedThemeId);

  // Headless PDF snapshot route: bare page, no app chrome, no glass skin —
  // just the chosen resume template (see PrintPreviewPage for why).
  if (isPrintRoute) {
    return (
      <Routes>
        <Route path="/print/resume" element={<PrintPreviewPage />} />
        <Route path="/print/letter" element={<PrintCoverLetterPage />} />
      </Routes>
    );
  }

  return (
    <div className="app-root" data-design={uiDesignSystem} data-theme={themeId} data-color-mode={colorMode}>
      <AppHeader />
      <div key={location.pathname} className="page-transition">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/preview" element={<PreviewPage />} />
          <Route path="/resumes" element={<ResumesPage />} />
          <Route path="/cover-letter" element={<CoverLetterPage />} />
        </Routes>
      </div>
      <AppFooter />
    </div>
  );
}
