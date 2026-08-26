import puppeteer, { type Browser } from 'puppeteer';
import { stashCoverLetterData, deleteCoverLetterData } from './coverLetterDataStore.js';
import type { ExportCoverLetterRequest } from '../schemas/exportCoverLetterRequest.schema.js';

// Separate from pdfRenderer.ts's browser instance would be wasteful — but
// launching a second shared Chromium purely to keep the two PDF pipelines
// decoupled is simpler and cheap enough (a handful of PDFs/minute, not
// thousands) to not warrant sharing a browserPromise across modules.
let browserPromise: Promise<Browser> | null = null;

function getBrowser(): Promise<Browser> {
  if (!browserPromise) {
    browserPromise = puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }
  return browserPromise;
}

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? 'http://localhost:5173';

export async function renderCoverLetterToPdf(data: ExportCoverLetterRequest): Promise<Buffer> {
  const token = stashCoverLetterData(data);
  const browser = await getBrowser();
  const page = await browser.newPage();
  try {
    await page.setViewport({ width: 1000, height: 1400 });
    await page.goto(`${CLIENT_ORIGIN}/print-letter/${token}`, { waitUntil: 'networkidle0', timeout: 15_000 });
    await page.waitForFunction('window.__RESUME_PRINT_READY__ === true', { timeout: 10_000 });
    const pdfBytes = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '18mm', bottom: '18mm', left: '18mm', right: '18mm' },
    });
    return Buffer.from(pdfBytes);
  } finally {
    await page.close();
    deleteCoverLetterData(token);
  }
}
