import { useCallback, useEffect, useRef, useState } from 'react';

const IDLE_MS = 1000;

interface Entry {
  key: string;
  promise: Promise<Blob>;
  controller: AbortController;
}

/**
 * Builds the PDF in the background a moment after the last change, so the
 * "Download" click hands over a file that already exists. The result is tied
 * to a fingerprint of the payload: any change makes it stale and starts a
 * new build (the old request is aborted). `getPdf` returns the up-to-date
 * file — instantly when it is ready, otherwise by waiting for or starting
 * the build.
 */
export function usePdfPrerender<T>(payload: T | null, render: (payload: T, signal: AbortSignal) => Promise<Blob>) {
  const key = payload === null ? null : JSON.stringify(payload);
  const entryRef = useRef<Entry | null>(null);
  const [ready, setReady] = useState<{ key: string; blob: Blob } | null>(null);
  const renderRef = useRef(render);
  renderRef.current = render;
  const payloadRef = useRef(payload);
  payloadRef.current = payload;

  const start = useCallback((forKey: string, data: T): Promise<Blob> => {
    entryRef.current?.controller.abort();
    const controller = new AbortController();
    const promise = renderRef.current(data, controller.signal);
    entryRef.current = { key: forKey, promise, controller };
    promise.then(
      (blob) => {
        if (entryRef.current?.key === forKey) setReady({ key: forKey, blob });
      },
      () => {
        // A failed or aborted background build is retried on demand by getPdf
        if (entryRef.current?.key === forKey) entryRef.current = null;
      },
    );
    return promise;
  }, []);

  useEffect(() => {
    if (key === null || entryRef.current?.key === key) return;
    const timer = setTimeout(() => start(key, payloadRef.current as T), IDLE_MS);
    return () => clearTimeout(timer);
  }, [key, start]);

  useEffect(() => () => entryRef.current?.controller.abort(), []);

  const getPdf = useCallback((): Promise<Blob> => {
    if (key === null) return Promise.reject(new Error('nothing to render'));
    if (entryRef.current?.key === key) return entryRef.current.promise;
    return start(key, payloadRef.current as T);
  }, [key, start]);

  const blob = ready && ready.key === key ? ready.blob : null;
  return { getPdf, blob };
}
