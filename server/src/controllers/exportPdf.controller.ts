import type { RequestHandler } from 'express';
import { renderResumeToPdf } from '../services/pdfRenderer.js';
import { getResumeData } from '../services/pdfDataStore.js';
import type { ExportPdfRequest } from '../schemas/exportPdfRequest.schema.js';

export const exportPdfController: RequestHandler = async (req, res) => {
  const data = req.body as ExportPdfRequest;
  try {
    const pdfBuffer = await renderResumeToPdf(data);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"');
    res.send(pdfBuffer);
  } catch (err) {
    console.error('PDF generation failed:', err);
    res.status(503).json({
      error: 'pdf_generation_failed',
      message: 'Не удалось сформировать PDF. Попробуйте, пожалуйста, ещё раз.',
    });
  }
};

// Fetched only by the headless print page (see client/src/pages/PrintPreviewPage.tsx),
// never by the regular app UI.
export const getExportPdfDataController: RequestHandler = (req, res) => {
  const { token } = req.params;
  const data = getResumeData(token);
  if (!data) {
    res.status(404).json({ error: 'not_found' });
    return;
  }
  res.json(data);
};
