import { useEffect, useState } from 'react';

declare global {
  interface Window {
    /** Injected by the server's headless Chrome before any app script runs. */
    __PRINT_DATA__?: unknown;
    /** Polled by the server: the page is laid out and safe to snapshot. */
    __RESUME_PRINT_READY__?: boolean;
  }
}

/**
 * Data for the headless-only print routes (see server/src/services/pdfRenderer.ts).
 * The server injects it straight into the page — no fetch and no server-side
 * store, so it works on serverless where every request may hit another
 * instance. Once rendered and fonts are loaded, the page flags itself ready.
 */
export function usePrintData<T>(): T | null {
  const [data] = useState(() => (window.__PRINT_DATA__ as T | undefined) ?? null);

  useEffect(() => {
    if (!data) return;
    let rafId = 0;
    void document.fonts.ready.then(() => {
      rafId = requestAnimationFrame(() => {
        window.__RESUME_PRINT_READY__ = true;
      });
    });
    return () => cancelAnimationFrame(rafId);
  }, [data]);

  return data;
}
