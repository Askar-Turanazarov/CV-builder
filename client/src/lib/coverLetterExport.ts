import { downloadCoverLetterPdf, type ExportCoverLetterPdfBody } from './api';
import { saveBlob } from './pdfExport';

/**
 * Real one-click PDF download — mirrors downloadPdf in pdfExport.ts, just for
 * the cover letter's own single clean layout instead of the resume templates.
 */
export async function downloadCoverLetter(body: ExportCoverLetterPdfBody): Promise<void> {
  saveBlob(await downloadCoverLetterPdf(body), 'cover-letter.pdf');
}
