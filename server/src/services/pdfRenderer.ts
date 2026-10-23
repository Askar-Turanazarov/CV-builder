import type { Browser, PDFOptions } from 'puppeteer-core';

let browserPromise: Promise<Browser> | null = null;

// On Vercel there is no system Chrome: puppeteer-core drives the serverless
// build from @sparticuz/chromium (needs PUPPETEER_SKIP_DOWNLOAD and the
// package's bin/ in the function bundle). Locally the full puppeteer package
// brings its own Chrome.
async function launchBrowser(): Promise<Browser> {
  if (process.env.VERCEL) {
    const [{ default: chromium }, { default: puppeteer }] = await Promise.all([
      import('@sparticuz/chromium'),
      import('puppeteer-core'),
    ]);
    chromium.setGraphicsMode = false; // no WebGL needed for documents
    return puppeteer.launch({ args: chromium.args, executablePath: await chromium.executablePath(), headless: true });
  }
  const { default: puppeteer } = await import('puppeteer');
  return puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] }) as Promise<Browser>;
}

// A single shared Chromium per process (per warm serverless instance) —
// a cold launch costs seconds, not worth paying on every PDF.
function getBrowser(): Promise<Browser> {
  browserPromise ??= launchBrowser().catch((err: unknown) => {
    browserPromise = null; // let the next request retry the launch
    throw err;
  });
  return browserPromise;
}

/** Starts Chromium ahead of time so the user's first PDF skips the cold launch. */
export async function warmUpBrowser(): Promise<void> {
  await getBrowser();
}

/**
 * Renders a client print route (e.g. `/print/resume`) into a PDF. The data is
 * injected into the page before any script runs (window.__PRINT_DATA__), so
 * no server-side handoff store is needed — that matters on serverless, where
 * the print page's follow-up request could land on another instance.
 */
export async function renderPrintPage(params: {
  origin: string;
  path: string;
  data: unknown;
  margin: PDFOptions['margin'];
}): Promise<Buffer> {
  const browser = await getBrowser();
  const page = await browser.newPage();
  try {
    await page.setViewport({ width: 1000, height: 1400 });
    await page.evaluateOnNewDocument((data) => {
      // Runs in the page; globalThis is window there (the server tsconfig has no DOM lib).
      (globalThis as unknown as { __PRINT_DATA__: unknown }).__PRINT_DATA__ = data;
    }, params.data);
    await page.goto(`${params.origin}${params.path}`, { waitUntil: 'networkidle0', timeout: 20_000 });
    await page.waitForFunction('window.__RESUME_PRINT_READY__ === true', { timeout: 10_000 });
    const pdfBytes = await page.pdf({ format: 'A4', printBackground: true, margin: params.margin });
    return Buffer.from(pdfBytes);
  } finally {
    await page.close();
  }
}
