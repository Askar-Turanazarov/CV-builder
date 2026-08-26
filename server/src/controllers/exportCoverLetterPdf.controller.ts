import type { RequestHandler } from 'express';
import { renderCoverLetterToPdf } from '../services/coverLetterPdfRenderer.js';
import { getCoverLetterData } from '../services/coverLetterDataStore.js';
import type { ExportCoverLetterRequest } from '../schemas/exportCoverLetterRequest.schema.js';

export const exportCoverLetterPdfController: RequestHandler = async (req, res) => {
  const data = req.body as ExportCoverLetterRequest;
  try {
    const pdfBuffer = await renderCoverLetterToPdf(data);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="cover-letter.pdf"');
    res.send(pdfBuffer);
  } catch (err) {
    console.error('Cover letter PDF generation failed:', err);
    res.status(503).json({
      error: 'pdf_generation_failed',
      message: 'Не удалось сформировать PDF. Попробуйте, пожалуйста, ещё раз.',
    });
  }
};

// Fetched only by the headless print page (see client/src/pages/PrintCoverLetterPage.tsx).
export const getCoverLetterPdfDataController: RequestHandler = (req, res) => {
  const { token } = req.params;
  const data = getCoverLetterData(token);
  if (!data) {
    res.status(404).json({ error: 'not_found' });
    return;
  }
  res.json(data);
};
