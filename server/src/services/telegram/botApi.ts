import { createHmac } from 'node:crypto';

const API_TIMEOUT_MS = 20_000;

export function botToken(): string | undefined {
  return process.env.TELEGRAM_BOT_TOKEN || undefined;
}

export function isTelegramConfigured(): boolean {
  return Boolean(botToken());
}

/**
 * Secret for the webhook's X-Telegram-Bot-Api-Secret-Token header, derived
 * from the bot token so the only env var to set is TELEGRAM_BOT_TOKEN.
 * Telegram allows only [A-Za-z0-9_-], up to 256 chars.
 */
export function webhookSecret(): string {
  return createHmac('sha256', botToken() ?? '').update('cv-forge:webhook').digest('base64url');
}

interface TelegramResponse<T> {
  ok: boolean;
  result?: T;
  description?: string;
}

async function call<T>(method: string, body: FormData | Record<string, unknown>): Promise<T> {
  const token = botToken();
  if (!token) throw new Error('TELEGRAM_BOT_TOKEN is not set');
  const isForm = body instanceof FormData;
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: isForm ? undefined : { 'Content-Type': 'application/json' },
    body: isForm ? body : JSON.stringify(body),
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
  });
  const json = (await res.json()) as TelegramResponse<T>;
  if (!json.ok) throw new Error(`Telegram ${method} failed: ${json.description ?? res.status}`);
  return json.result as T;
}

let usernamePromise: Promise<string> | null = null;

/** The bot's @username (for t.me links), fetched once per instance. */
export function botUsername(): Promise<string> {
  usernamePromise ??= call<{ username: string }>('getMe', {})
    .then((me) => me.username)
    .catch((err: unknown) => {
      usernamePromise = null;
      throw err;
    });
  return usernamePromise;
}

export function sendMessage(chatId: number, html: string) {
  return call('sendMessage', {
    chat_id: chatId,
    text: html,
    parse_mode: 'HTML',
    link_preview_options: { is_disabled: true },
  });
}

export function sendChatAction(chatId: number, action: 'typing' | 'upload_document') {
  return call('sendChatAction', { chat_id: chatId, action });
}

export function sendDocument(chatId: number, file: Buffer, filename: string, captionHtml: string) {
  const form = new FormData();
  form.append('chat_id', String(chatId));
  form.append('caption', captionHtml);
  form.append('parse_mode', 'HTML');
  form.append('document', new Blob([new Uint8Array(file)], { type: 'application/pdf' }), filename);
  return call('sendDocument', form);
}

let webhookPromise: Promise<void> | null = null;

/**
 * Points the bot at this deployment's webhook if it isn't already. Runs once
 * per warm instance and only for production, so preview deployments and
 * local dev never steal the webhook from the live site.
 */
export function ensureWebhook(baseUrl: string): Promise<void> {
  if (process.env.VERCEL_ENV !== 'production') return Promise.resolve();
  webhookPromise ??= (async () => {
    const url = `${baseUrl}/api/telegram/webhook`;
    const info = await call<{ url: string }>('getWebhookInfo', {});
    if (info.url === url) return;
    await call('setWebhook', {
      url,
      secret_token: webhookSecret(),
      allowed_updates: ['message'],
      drop_pending_updates: true,
    });
    console.log(`[telegram] webhook set to ${url}`);
  })().catch((err: unknown) => {
    webhookPromise = null;
    throw err;
  });
  return webhookPromise;
}
