import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';

const ACTIVE_SELECTOR = '[data-active="true"], [aria-current="page"]';

/**
 * Positions a "pill" behind the active item of a segmented group (language,
 * design, header nav) so it can slide between items instead of jumping.
 * The active item is found by `data-active="true"` or NavLink's
 * `aria-current="page"`; `activeKey` re-measures when the selection changes,
 * a ResizeObserver covers font loading and wrapping.
 */
export function useSlidingIndicator<T extends HTMLElement>(activeKey: unknown) {
  const containerRef = useRef<T>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<CSSProperties>({ opacity: 0 });
  // The first placement must not animate in from the corner.
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const update = () => {
      const active = container.querySelector<HTMLElement>(ACTIVE_SELECTOR);
      if (!active) {
        setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
        return;
      }
      setIndicatorStyle({
        opacity: 1,
        width: active.offsetWidth,
        height: active.offsetHeight,
        transform: `translate(${active.offsetLeft}px, ${active.offsetTop}px)`,
      });
    };

    update();
    const frame = requestAnimationFrame(() => setReady(true));
    const observer = new ResizeObserver(update);
    observer.observe(container);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [activeKey]);

  return { containerRef, indicatorStyle, ready };
}
