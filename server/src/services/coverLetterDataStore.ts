import type { ExportCoverLetterRequest } from '../schemas/exportCoverLetterRequest.schema.js';

interface StoredEntry {
  data: ExportCoverLetterRequest;
  expiresAt: number;
}

// Short-lived handoff store, mirroring pdfDataStore.ts for the resume PDF
// pipeline — the headless Puppeteer browser has no access to the real
// user's localStorage, so the client POSTs a snapshot here and the
// /print-letter/:token page fetches it back by token.
const TTL_MS = 60_000;
const store = new Map<string, StoredEntry>();

function purgeExpired(): void {
  const now = Date.now();
  for (const [token, entry] of store) {
    if (entry.expiresAt < now) store.delete(token);
  }
}

export function stashCoverLetterData(data: ExportCoverLetterRequest): string {
  purgeExpired();
  const token = crypto.randomUUID();
  store.set(token, { data, expiresAt: Date.now() + TTL_MS });
  return token;
}

export function getCoverLetterData(token: string): ExportCoverLetterRequest | null {
  purgeExpired();
  return store.get(token)?.data ?? null;
}

export function deleteCoverLetterData(token: string): void {
  store.delete(token);
}
