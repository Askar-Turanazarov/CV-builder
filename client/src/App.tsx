import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useResumeStore } from './store/resumeStore';
import AppHeader from './components/common/AppHeader';
import LandingPage from './pages/LandingPage';
import EditorPage from './pages/EditorPage';
import PreviewPage from './pages/PreviewPage';
import PrintPreviewPage from './pages/PrintPreviewPage';
import type { UiLanguage } from './types/resume';

const SUPPORTED_LANGUAGES: UiLanguage[] = ['ru', 'en', 'uz'];
const STORAGE_KEY = 'resume-builder:v1';

export default function App() {
  const location = useLocation();
  const isPrintRoute = location.pathname.startsWith('/print/');
  const { i18n } = useTranslation();
  const uiLanguage = useResumeStore((s) => s.data.uiLanguage);
  const setUiLanguage = useResumeStore((s) => s.setUiLanguage);

  useEffect(() => {
    // First-ever visit: adopt the browser-detected language as the default.
    // Returning visitor: resumeStore's persisted uiLanguage is the source of
    // truth, so just sync i18next to it.
    const hasPersisted = localStorage.getItem(STORAGE_KEY) !== null;
    if (hasPersisted) {
      void i18n.changeLanguage(uiLanguage);
    } else {
      const detected = i18n.language?.split('-')[0] as UiLanguage;
      const lang = SUPPORTED_LANGUAGES.includes(detected) ? detected : 'ru';
      setUiLanguage(lang);
      void i18n.changeLanguage(lang);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const uiDesignSystem = useResumeStore((s) => s.data.uiDesignSystem);
  const colorMode = useResumeStore((s) => s.data.colorMode);

  // Headless PDF snapshot route: bare page, no app chrome, no glass skin —
  // just the chosen resume template (see PrintPreviewPage for why).
  if (isPrintRoute) {
    return (
      <Routes>
        <Route path="/print/:token" element={<PrintPreviewPage />} />
      </Routes>
    );
  }

  return (
    <div className="app-root" data-design={uiDesignSystem} data-color-mode={colorMode}>
      <AppHeader />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/editor" element={<EditorPage />} />
        <Route path="/preview" element={<PreviewPage />} />
      </Routes>
    </div>
  );
}
