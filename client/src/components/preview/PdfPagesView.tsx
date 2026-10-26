import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../common/Button';
import Spinner from '../common/Spinner';
import { openPdf } from '../../lib/pdfDocument';
import styles from './PdfPagesView.module.css';

// A4 at 96 dpi: pages never grow past their real size
const MAX_PAGE_WIDTH = 794;

/**
 * The pages of the very file "Download PDF" hands over (the background
 * prerender), drawn with pdf.js: what you see here is what you get.
 */
export default function PdfPagesView({ blob, getPdf }: { blob: Blob | null; getPdf: () => Promise<Blob> }) {
  const { t } = useTranslation('common');
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  // No file yet: make sure the build runs now instead of after the idle delay
  useEffect(() => {
    if (blob) return;
    let current = true;
    setFailed(false);
    // A rejection from a build that a newer change aborted is not a failure
    getPdf().catch(() => current && setFailed(true));
    return () => {
      current = false;
    };
  }, [blob, getPdf, attempt]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setWidth(Math.min(MAX_PAGE_WIDTH, Math.round(el.clientWidth))));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!blob || !el || !width) return;
    let cancelled = false;
    const tasks: { cancel: () => void }[] = [];
    void openPdf(blob).then(async (doc) => {
      const canvases: HTMLCanvasElement[] = [];
      const dpr = window.devicePixelRatio || 1;
      for (let n = 1; n <= doc.numPages && !cancelled; n++) {
        const page = await doc.getPage(n);
        const base = page.getViewport({ scale: 1 });
        const viewport = page.getViewport({ scale: (width / base.width) * dpr });
        const canvas = document.createElement('canvas');
        canvas.className = styles.page;
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        canvas.style.width = `${width}px`;
        canvas.style.aspectRatio = `${base.width} / ${base.height}`;
        const task = page.render({ canvas, viewport });
        tasks.push(task);
        await task.promise.catch(() => undefined);
        canvases.push(canvas);
      }
      // Swap all pages at once so a resize doesn't flash empty sheets
      if (!cancelled) el.replaceChildren(...canvases);
    });
    return () => {
      cancelled = true;
      tasks.forEach((task) => task.cancel());
    };
  }, [blob, width]);

  return (
    <div className={styles.wrapper}>
      {!blob && (
        <div className={styles.placeholder}>
          {failed ? (
            <>
              <p>{t('previewKind.failed')}</p>
              <Button variant="secondary" onClick={() => setAttempt((n) => n + 1)}>
                {t('previewKind.retry')}
              </Button>
            </>
          ) : (
            <p className={styles.building}>
              <Spinner /> {t('previewKind.building')}
            </p>
          )}
        </div>
      )}
      <div ref={containerRef} className={styles.pages} hidden={!blob} />
    </div>
  );
}
