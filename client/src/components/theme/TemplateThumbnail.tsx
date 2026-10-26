import { useLayoutEffect, useRef, useState } from 'react';
import ResumeTemplate from '../templates/ResumeTemplate';
import type { ResumeData } from '../../types/resume';
import styles from './TemplateThumbnail.module.css';

// Templates are laid out at this width, then scaled down to fit the card.
const TEMPLATE_WIDTH = 760;

/** A live, non-interactive miniature of a template filled with `data`. */
export default function TemplateThumbnail({ data }: { data: ResumeData }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.25);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const update = () => setScale(frame.clientWidth / TEMPLATE_WIDTH);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={frameRef} className={styles.frame} aria-hidden="true">
      <div
        className={styles.scale}
        style={{ width: TEMPLATE_WIDTH, transform: `scale(${scale})` }}
        data-theme={data.selectedThemeId}
        data-color-mode={data.colorMode}
      >
        <ResumeTemplate data={data} />
      </div>
    </div>
  );
}
