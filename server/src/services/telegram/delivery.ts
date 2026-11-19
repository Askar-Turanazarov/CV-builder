import { randomBytes } from 'node:crypto';
import type { ExportPdfRequest } from '../../schemas/exportPdfRequest.schema.js';
import { renderPrintPage } from '../pdfRenderer.js';
import { printOrigin } from '../printOrigin.js';
import { sendChatAction, sendDocument, sendMessage } from './botApi.js';
import { handoffStore } from './handoffStore.js';
import { documentCaption, documentFilename, formatResumeMessage } from './formatResume.js';

/** How long a "send to Telegram" link stays valid. */
export const LINK_TTL_SECONDS = 15 * 60;

export type HandoffStatus =
  | { state: 'pending' }
  | { state: 'processing' }
  | { state: 'delivered'; chatToken: string }
  | { state: 'failed' };

export const dataKey = (token: string) => `tg:data:${token}`;
export const statusKey = (token: string) => `tg:status:${token}`;

/** 128-bit, URL-safe: fits Telegram's /start payload rules ([A-Za-z0-9_-], ≤64). */
export function newLinkToken(): string {
  return randomBytes(16).toString('base64url');
}

/** How long a device stays linked to a chat after the first delivery. */
export const CHAT_TOKEN_TTL_SECONDS = 3 * 60 * 60;

const chatLinkKey = (chatToken: string) => `tg:chat:${chatToken}`;

/**
 * Lets the site send to the same chat again without the bot round-trip: the
 * client keeps this token in localStorage after the first delivery. It is a
 * random key (192 bits) whose chat id lives only in the server store, so the
 * browser never learns the Telegram chat id; it expires on its own, so a
 * shared device doesn't stay linked for good.
 */
export async function createChatToken(chatId: number): Promise<string> {
  const chatToken = randomBytes(24).toString('base64url');
  await handoffStore().set(chatLinkKey(chatToken), chatId, CHAT_TOKEN_TTL_SECONDS);
  return chatToken;
}

/** The chat a token stands for, or null when it is unknown or expired. */
export async function resolveChatToken(chatToken: string): Promise<number | null> {
  if (!/^[\w-]{32}$/.test(chatToken)) return null;
  const chatId = await handoffStore().get<number>(chatLinkKey(chatToken));
  return Number.isSafeInteger(chatId) ? chatId : null;
}

/** Renders the resume PDF and sends it with a formatted text card. */
export async function deliverResume(chatId: number, resume: ExportPdfRequest): Promise<void> {
  await sendChatAction(chatId, 'upload_document').catch(() => undefined);
  const pdf = await renderPrintPage({
    origin: printOrigin(),
    path: '/print/resume',
    data: resume,
    margin: { top: '12mm', bottom: '12mm', left: '12mm', right: '12mm' },
  });
  await sendMessage(chatId, formatResumeMessage(resume));
  await sendDocument(chatId, pdf, documentFilename(resume), documentCaption(resume));
}
