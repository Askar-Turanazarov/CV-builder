import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import type { ExportPdfRequest } from '../../schemas/exportPdfRequest.schema.js';
import { renderPrintPage } from '../pdfRenderer.js';
import { printOrigin } from '../printOrigin.js';
import { botToken, sendChatAction, sendDocument, sendMessage } from './botApi.js';
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

function sign(chatId: number): string {
  return createHmac('sha256', botToken() ?? '').update(`chat:${chatId}`).digest('base64url');
}

/**
 * A chat id the site may send to again without the bot round-trip: the
 * client keeps it in localStorage after the first delivery. Signed, so a
 * visitor can't make the bot message an arbitrary chat.
 */
export function createChatToken(chatId: number): string {
  return `${chatId}.${sign(chatId)}`;
}

export function verifyChatToken(chatToken: string): number | null {
  const [idPart, signature] = chatToken.split('.');
  const chatId = Number(idPart);
  if (!Number.isSafeInteger(chatId) || !signature) return null;
  const expected = Buffer.from(sign(chatId));
  const given = Buffer.from(signature);
  return expected.length === given.length && timingSafeEqual(expected, given) ? chatId : null;
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
