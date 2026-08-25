import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTemplateComponent } from '../components/templates/templateRegistry';
import type { ResumeData } from '../types/resume';

declare global {
  interface Window {
    __RESUME_PRINT_READY__?: boolean;
  }
}

/**
 * Headless-only page: Puppeteer (server/src/services/pdfRenderer.ts) navigates
 * here to snapshot a resume into a PDF. Not part of the normal app shell — no
 * header, no wizard, just the chosen template rendered full-bleed. The
 * headless browser has no access to the real user's localStorage, so the
 * resume data is fetched by a short-lived token instead of from the store.
 */
export default function PrintPreviewPage() {
  const { token } = useParams<{ token: string }>();
  const [data, setData] = useState<ResumeData | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    fetch(`/api/export-pdf/data/${token}`)
      .then((res) => {
        if (!res.ok) throw new Error('not_found');
        return res.json() as Promise<ResumeData>;
      })
      .then((resumeData) => {
        if (!cancelled) setData({ ...resumeData, viewMode: 'document' });
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

  const TemplateComponent = getTemplateComponent(data.selectedTemplateId);

  return (
    <div data-theme={data.selectedThemeId} data-color-mode={data.colorMode}>
      <TemplateComponent data={data} />
    </div>
  );
}
