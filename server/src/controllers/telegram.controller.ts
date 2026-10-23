import type { RequestHandler } from 'express';
import type { ExportPdfRequest } from '../schemas/exportPdfRequest.schema.js';
import { handoffStore } from '../services/telegram/handoffStore.js';
import { botUsername, ensureWebhook, isTelegramConfigured, sendMessage, webhookSecret } from '../services/telegram/botApi.js';
import {
  LINK_TTL_SECONDS,
  createChatToken,
  dataKey,
  deliverResume,
  newLinkToken,
  statusKey,
  verifyChatToken,
  type HandoffStatus,
} from '../services/telegram/delivery.js';
import { botText, resumeBotText } from '../services/telegram/formatResume.js';
import { printOrigin } from '../services/printOrigin.js';

const notConfigured = { error: 'telegram_not_configured' };

/** Lets the client show the button only when a bot is set up. */
export const telegramConfigController: RequestHandler = async (_req, res) => {
  if (!isTelegramConfigured()) {
    res.json({ enabled: false });
    return;
  }
  try {
    const [username] = await Promise.all([botUsername(), ensureWebhook(printOrigin())]);
    res.json({ enabled: true, botUsername: username });
  } catch (err) {
    console.error('[telegram] config failed:', err);
    res.json({ enabled: false });
  }
};

/** Stores the resume for a short while and returns a t.me deep link. */
export const createTelegramLinkController: RequestHandler = async (req, res) => {
  if (!isTelegramConfigured()) {
    res.status(503).json(notConfigured);
    return;
  }
  try {
    const token = newLinkToken();
    const store = handoffStore();
    await Promise.all([
      store.set(dataKey(token), req.body as ExportPdfRequest, LINK_TTL_SECONDS),
      store.set(statusKey(token), { state: 'pending' } satisfies HandoffStatus, LINK_TTL_SECONDS),
    ]);
    const username = await botUsername();
    res.json({ token, url: `https://t.me/${username}?start=${token}`, expiresIn: LINK_TTL_SECONDS });
  } catch (err) {
    console.error('[telegram] link creation failed:', err);
    res.status(503).json({ error: 'telegram_unavailable' });
  }
};

/** Polled by the client while the user is in the bot. */
export const telegramStatusController: RequestHandler = async (req, res) => {
  const token = String(req.query.token ?? '');
  if (!/^[\w-]{16,64}$/.test(token)) {
    res.status(400).json({ error: 'invalid_request' });
    return;
  }
  const status = await handoffStore().get<HandoffStatus>(statusKey(token));
  res.json(status ?? { state: 'expired' });
};

/** Repeat delivery straight to a chat the user already linked. */
export const sendToTelegramController: RequestHandler = async (req, res) => {
  if (!isTelegramConfigured()) {
    res.status(503).json(notConfigured);
    return;
  }
  const { chatToken, resume } = req.body as { chatToken: string; resume: ExportPdfRequest };
  const chatId = verifyChatToken(chatToken);
  if (chatId === null) {
    res.status(401).json({ error: 'telegram_chat_invalid' });
    return;
  }
  try {
    await deliverResume(chatId, resume);
    res.json({ ok: true });
  } catch (err) {
    console.error('[telegram] direct send failed:', err);
    // A user who blocked the bot shows up as 403 from Telegram.
    const blocked = err instanceof Error && /403|blocked|chat not found/i.test(err.message);
    res.status(blocked ? 410 : 503).json({ error: blocked ? 'telegram_chat_gone' : 'telegram_unavailable' });
  }
};

interface TelegramUpdate {
  message?: {
    chat: { id: number; type: string };
    from?: { language_code?: string };
    text?: string;
  };
}

/**
 * Bot webhook. Always answers 200 (otherwise Telegram keeps retrying the
 * update); the work happens before the response so the serverless function
 * isn't frozen mid-delivery.
 */
export const telegramWebhookController: RequestHandler = async (req, res) => {
  if (req.get('X-Telegram-Bot-Api-Secret-Token') !== webhookSecret()) {
    res.status(401).end();
    return;
  }
  const message = (req.body as TelegramUpdate).message;
  if (!message?.text || message.chat.type !== 'private') {
    res.sendStatus(200);
    return;
  }

  const chatId = message.chat.id;
  const lang = message.from?.language_code;
  const payload = /^\/start(?:\s+([\w-]+))?/.exec(message.text)?.[1];

  try {
    if (!payload) {
      await sendMessage(chatId, botText(lang, 'welcome'));
      return;
    }

    const store = handoffStore();
    const resume = await store.take<ExportPdfRequest>(dataKey(payload));
    if (!resume) {
      // Telegram may redeliver the same update while we're still working on
      // it: an in-flight or finished token isn't "expired", just stay quiet.
      const status = await store.get<HandoffStatus>(statusKey(payload));
      if (!status || status.state === 'pending' || status.state === 'failed') {
        await sendMessage(chatId, botText(lang, 'expired'));
      }
      return;
    }

    await store.set(statusKey(payload), { state: 'processing' } satisfies HandoffStatus, LINK_TTL_SECONDS);
    try {
      await sendMessage(chatId, resumeBotText(resume, 'preparing'));
      await deliverResume(chatId, resume);
      const delivered: HandoffStatus = { state: 'delivered', chatToken: createChatToken(chatId) };
      await store.set(statusKey(payload), delivered, LINK_TTL_SECONDS);
    } catch (err) {
      console.error('[telegram] delivery failed:', err);
      await store.set(statusKey(payload), { state: 'failed' } satisfies HandoffStatus, LINK_TTL_SECONDS);
      await sendMessage(chatId, resumeBotText(resume, 'failed')).catch(() => undefined);
    }
  } catch (err) {
    console.error('[telegram] webhook error:', err);
  } finally {
    if (!res.headersSent) res.sendStatus(200);
  }
};
