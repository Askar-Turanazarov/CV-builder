import type { RequestHandler } from 'express';
import type { PDFOptions } from 'puppeteer-core';
import { renderPrintPage, warmUpBrowser } from '../services/pdfRenderer.js';
import { printOrigin } from '../services/printOrigin.js';

export function createPdfExportController(params: {
  printPath: string;
  filename: string;
  margin: PDFOptions['margin'];
}): RequestHandler {
  return async (req, res) => {
    try {
      const pdf = await renderPrintPage({
        origin: printOrigin(),
        path: params.printPath,
        data: req.body,
        margin: params.margin,
      });
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${params.filename}"`);
      res.send(pdf);
    } catch (err) {
      console.error(`PDF generation failed (${params.printPath}):`, err);
      res.status(503).json({
        error: 'pdf_generation_failed',
        message: 'Не удалось сформировать PDF. Попробуйте, пожалуйста, ещё раз.',
      });
    }
  };
}

// Called by the client when the preview/cover-letter page opens, so the
// Chromium cold start happens while the user is still looking at the page.
export const warmUpPdfController: RequestHandler = async (_req, res) => {
  try {
    await warmUpBrowser();
    res.status(204).end();
  } catch (err) {
    console.error('PDF warm-up failed:', err);
    res.status(503).json({ error: 'pdf_warmup_failed' });
  }
};
