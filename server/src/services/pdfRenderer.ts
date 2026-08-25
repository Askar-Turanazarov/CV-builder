import puppeteer, { type Browser } from 'puppeteer';
import { stashResumeData, deleteResumeData } from './pdfDataStore.js';
import type { ExportPdfRequest } from '../schemas/exportPdfRequest.schema.js';

let browserPromise: Promise<Browser> | null = null;

// Lazily launch a single shared headless Chromium instance rather than one
// per request — a cold launch costs ~1-2s, not worth paying on every PDF.
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

export async function renderResumeToPdf(data: ExportPdfRequest): Promise<Buffer> {
  const token = stashResumeData(data);
  const browser = await getBrowser();
  const page = await browser.newPage();
  try {
    await page.setViewport({ width: 1000, height: 1400 });
    await page.goto(`${CLIENT_ORIGIN}/print/${token}`, { waitUntil: 'networkidle0', timeout: 15_000 });
    await page.waitForFunction('window.__RESUME_PRINT_READY__ === true', { timeout: 10_000 });
    const pdfBytes = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '12mm', bottom: '12mm', left: '12mm', right: '12mm' },
    });
    return Buffer.from(pdfBytes);
  } finally {
    await page.close();
    deleteResumeData(token);
  }
}
