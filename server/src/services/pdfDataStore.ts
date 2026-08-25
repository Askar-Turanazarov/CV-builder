import type { ExportPdfRequest } from '../schemas/exportPdfRequest.schema.js';

interface StoredEntry {
  data: ExportPdfRequest;
  expiresAt: number;
}

// Short-lived handoff store: the headless Puppeteer browser has no access to
// the real user's localStorage, so the client POSTs a full snapshot here and
// the /print/:token page fetches it back by token. Non-destructive read —
// React StrictMode double-invokes effects in dev, so a "consume on first
// read" store would break the second fetch; the renderer explicitly deletes
// the entry once PDF generation is actually done.
const TTL_MS = 60_000;
const store = new Map<string, StoredEntry>();

function purgeExpired(): void {
  const now = Date.now();
  for (const [token, entry] of store) {
    if (entry.expiresAt < now) store.delete(token);
  }
}

export function stashResumeData(data: ExportPdfRequest): string {
  purgeExpired();
  const token = crypto.randomUUID();
  store.set(token, { data, expiresAt: Date.now() + TTL_MS });
  return token;
}

export function getResumeData(token: string): ExportPdfRequest | null {
  purgeExpired();
  return store.get(token)?.data ?? null;
}

export function deleteResumeData(token: string): void {
  store.delete(token);
}
