import { getTemplateComponent } from '../components/templates/templateRegistry';
import { usePrintData } from '../hooks/usePrintData';
import type { ResumeData } from '../types/resume';

/**
 * Headless-only page: Puppeteer (server/src/services/pdfRenderer.ts) navigates
 * here to snapshot a resume into a PDF. Not part of the normal app shell — no
 * header, no wizard, just the chosen template rendered full-bleed. The
 * headless browser has no access to the user's localStorage, so the resume
 * arrives via usePrintData instead of the store.
 */
export default function PrintPreviewPage() {
  const data = usePrintData<ResumeData>();
  if (!data) return null;

  const TemplateComponent = getTemplateComponent(data.selectedTemplateId);

  return (
    <div data-theme={data.selectedThemeId} data-color-mode={data.colorMode}>
      <TemplateComponent data={{ ...data, viewMode: 'document' }} />
    </div>
  );
}
