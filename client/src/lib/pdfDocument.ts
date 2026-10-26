import type { PDFDocumentProxy } from 'pdfjs-dist/legacy/build/pdf.mjs';

type PdfJs = typeof import('pdfjs-dist/legacy/build/pdf.mjs');

// pdf.js is heavy, so it loads only when the preview actually shows PDF
// pages or page breaks. The legacy build also runs on older Safari.
let pdfjsPromise: Promise<PdfJs> | null = null;

function loadPdfJs(): Promise<PdfJs> {
  pdfjsPromise ??= Promise.all([
    import('pdfjs-dist/legacy/build/pdf.mjs'),
    import('pdfjs-dist/legacy/build/pdf.worker.min.mjs?url'),
  ]).then(([lib, worker]) => {
    lib.GlobalWorkerOptions.workerSrc = worker.default;
    return lib;
  });
  return pdfjsPromise;
}

const documents = new WeakMap<Blob, Promise<PDFDocumentProxy>>();

/** Parses the PDF once per file; the lines and the pages view share it. */
export function openPdf(blob: Blob): Promise<PDFDocumentProxy> {
  let doc = documents.get(blob);
  if (!doc) {
    doc = Promise.all([loadPdfJs(), blob.arrayBuffer()]).then(
      ([lib, buffer]) => lib.getDocument({ data: new Uint8Array(buffer) }).promise,
    );
    documents.set(blob, doc);
  }
  return doc;
}

/**
 * The first few text runs of every page after the first, i.e. where the
 * real PDF broke the pages. The preview finds the same text on screen to
 * draw its page lines.
 */
export async function readPageStarts(blob: Blob): Promise<string[][]> {
  const doc = await openPdf(blob);
  const starts: string[][] = [];
  for (let n = 2; n <= doc.numPages; n++) {
    const page = await doc.getPage(n);
    const content = await page.getTextContent();
    starts.push(
      content.items
        .map((item) => ('str' in item ? item.str : ''))
        .filter((text) => text.trim().length > 0)
        .slice(0, 8),
    );
  }
  return starts;
}
