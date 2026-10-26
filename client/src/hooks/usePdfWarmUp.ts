import { useEffect } from 'react';
import { warmUpPdf } from '../lib/api';

// Serverless instances fall asleep after a few idle minutes; ping a bit sooner
const KEEP_WARM_MS = 4 * 60 * 1000;

/**
 * Starts the server's headless Chrome while the user is still filling the
 * form and keeps it running while the tab is visible, so the PDF build at
 * the end skips the multi-second Chromium launch.
 */
export function usePdfWarmUp(active = true): void {
  useEffect(() => {
    if (!active) return;
    warmUpPdf();
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') warmUpPdf();
    }, KEEP_WARM_MS);
    const onVisible = () => {
      if (document.visibilityState === 'visible') warmUpPdf();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [active]);
}
