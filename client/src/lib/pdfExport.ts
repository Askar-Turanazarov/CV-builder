import { downloadResumePdf, ApiError } from './api';
import type { ResumeData, ViewMode } from '../types/resume';

/**
 * Physical/system print — opens the browser's native print dialog. Forcing
 * 'document' view mode gives a fixed A4-proportioned layout regardless of
 * whatever responsive breakpoint the user was viewing at.
 */
export function printResume(currentViewMode: ViewMode, setViewMode: (mode: ViewMode) => void): void {
  const restore = () => {
    setViewMode(currentViewMode);
    window.removeEventListener('afterprint', restore);
  };

  setViewMode('document');
  window.addEventListener('afterprint', restore);

  // Two rAFs so the view-mode re-render has actually committed to the DOM
  // before the print dialog captures layout.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      window.print();
    });
  });
}

/**
 * Real one-click PDF download — no print dialog. The server renders the
 * resume in headless Chrome (see server/src/services/pdfRenderer.ts) and
 * streams back an actual PDF file, which we save via a synthetic <a download>
 * click.
 */
export async function downloadPdf(data: ResumeData): Promise<void> {
  const blob = await downloadResumePdf({ ...data, viewMode: 'document' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'resume.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // Give the browser a tick to start the download before revoking.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export { ApiError };
