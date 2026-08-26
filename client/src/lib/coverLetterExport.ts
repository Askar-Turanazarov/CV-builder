import { downloadCoverLetterPdf, type ExportCoverLetterPdfBody } from './api';

/**
 * Real one-click PDF download — mirrors downloadPdf in pdfExport.ts, just for
 * the cover letter's own single clean layout instead of the resume templates.
 */
export async function downloadCoverLetter(body: ExportCoverLetterPdfBody): Promise<void> {
  const blob = await downloadCoverLetterPdf(body);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'cover-letter.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
