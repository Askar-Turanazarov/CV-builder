import { useEffect, useState, type RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { readPageStarts } from '../../lib/pdfDocument';
import styles from './PageBreakLines.module.css';

// Short runs ("•", "2021") occur everywhere; they can't pin a page start
const MIN_MATCH_LENGTH = 4;

interface TextNodeInfo {
  node: Text;
  /** Lower-cased text without whitespace: PDF text loses spaces and CSS case */
  plain: string;
  /** plain index → offset in node.data */
  offsets: number[];
}

function collectTextNodes(root: HTMLElement): TextNodeInfo[] {
  const nodes: TextNodeInfo[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode() as Text | null; node; node = walker.nextNode() as Text | null) {
    const parent = node.parentElement;
    if (!parent || parent.closest('.no-print')) continue;
    let plain = '';
    const offsets: number[] = [];
    for (let i = 0; i < node.data.length; i++) {
      if (/\s/.test(node.data[i])) continue;
      plain += node.data[i].toLowerCase();
      offsets.push(i);
    }
    if (plain) nodes.push({ node, plain, offsets });
  }
  return nodes;
}

const normalize = (text: string) => text.replace(/\s+/g, '').toLowerCase();

/**
 * Finds where each PDF page starts in the on-screen resume and returns the
 * line positions (px from the top of `root`). Matching text rather than
 * simulating Chrome's pagination keeps the lines true to the actual file,
 * whatever width the preview has.
 */
function locateBreaks(root: HTMLElement, pageStarts: string[][]): number[] {
  const nodes = collectTextNodes(root);
  const rootTop = root.getBoundingClientRect().top;
  const lines: number[] = [];
  let fromNode = 0;
  for (const candidates of pageStarts) {
    let found = false;
    for (const candidate of candidates.map(normalize).filter((c) => c.length >= MIN_MATCH_LENGTH)) {
      for (let i = fromNode; i < nodes.length; i++) {
        const at = nodes[i].plain.indexOf(candidate);
        if (at === -1) continue;
        const { node, offsets } = nodes[i];
        const range = document.createRange();
        range.setStart(node, offsets[at]);
        range.setEnd(node, offsets[at + candidate.length - 1] + 1);
        const rect = range.getBoundingClientRect();
        if (rect.height === 0) continue;
        const y = rect.top - rootTop - 6;
        // Two-column layouts can start a page in the side column; a line
        // above the previous one would only confuse
        if (y > (lines[lines.length - 1] ?? 0)) lines.push(y);
        fromNode = i;
        found = true;
        break;
      }
      if (found) break;
    }
  }
  return lines;
}

export default function PageBreakLines({ blob, targetRef }: { blob: Blob | null; targetRef: RefObject<HTMLElement> }) {
  const { t } = useTranslation('common');
  const [pageStarts, setPageStarts] = useState<string[][] | null>(null);
  const [lines, setLines] = useState<number[]>([]);

  useEffect(() => {
    setPageStarts(null);
    if (!blob) return;
    let alive = true;
    readPageStarts(blob).then(
      (starts) => alive && setPageStarts(starts),
      () => undefined,
    );
    return () => {
      alive = false;
    };
  }, [blob]);

  useEffect(() => {
    const root = targetRef.current;
    if (!root || !pageStarts) {
      setLines([]);
      return;
    }
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setLines(locateBreaks(root, pageStarts)));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(root);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [pageStarts, targetRef]);

  return (
    <div className={`${styles.overlay} no-print`} aria-hidden="true">
      {lines.map((y, i) => (
        <div key={i} className={styles.line} style={{ top: y }}>
          <span className={styles.label}>{t('previewKind.pageLabel', { n: i + 2 })}</span>
        </div>
      ))}
    </div>
  );
}
