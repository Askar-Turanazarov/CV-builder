import CoverLetterDocument from '../components/coverLetter/CoverLetterDocument';
import { usePrintData } from '../hooks/usePrintData';
import type { ExportCoverLetterPdfBody } from '../lib/api';

/**
 * Headless-only page: Puppeteer (server/src/services/pdfRenderer.ts)
 * navigates here to snapshot a cover letter into a PDF. Same data handoff as
 * PrintPreviewPage.
 */
export default function PrintCoverLetterPage() {
  const data = usePrintData<ExportCoverLetterPdfBody>();
  if (!data) return null;

  const dateIso = new Date().toISOString().slice(0, 10);

  return (
    <div data-theme={data.selectedThemeId} data-color-mode={data.colorMode}>
      <CoverLetterDocument data={{ ...data, dateIso }} />
    </div>
  );
}
