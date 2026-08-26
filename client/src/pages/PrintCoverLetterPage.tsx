import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CoverLetterDocument, { type CoverLetterDocumentData } from '../components/coverLetter/CoverLetterDocument';

interface StoredCoverLetterData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  content: string;
  targetRole: string;
  targetCompany: string;
  selectedThemeId: string;
  colorMode: 'light' | 'dark';
  uiLanguage: CoverLetterDocumentData['uiLanguage'];
}

declare global {
  interface Window {
    __RESUME_PRINT_READY__?: boolean;
  }
}

/**
 * Headless-only page: Puppeteer (server/src/services/coverLetterPdfRenderer.ts)
 * navigates here to snapshot a cover letter into a PDF. Mirrors
 * PrintPreviewPage.tsx's token handoff — the headless browser has no access
 * to the real user's localStorage.
 */
export default function PrintCoverLetterPage() {
  const { token } = useParams<{ token: string }>();
  const [data, setData] = useState<StoredCoverLetterData | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    fetch(`/api/export-cover-letter-pdf/data/${token}`)
      .then((res) => {
        if (!res.ok) throw new Error('not_found');
        return res.json() as Promise<StoredCoverLetterData>;
      })
      .then((letterData) => {
        if (!cancelled) setData(letterData);
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    if (!data) return;
    let rafId = 0;
    void document.fonts.ready.then(() => {
      rafId = requestAnimationFrame(() => {
        window.__RESUME_PRINT_READY__ = true;
      });
    });
    return () => cancelAnimationFrame(rafId);
  }, [data]);

  if (notFound) return null;
  if (!data) return null;

  const dateIso = new Date().toISOString().slice(0, 10);

  return (
    <div data-theme={data.selectedThemeId} data-color-mode={data.colorMode}>
      <CoverLetterDocument data={{ ...data, dateIso }} />
    </div>
  );
}
