import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import QRCode from 'qrcode';
import Button from '../common/Button';
import Spinner from '../common/Spinner';
import {
  ApiError,
  createTelegramLink,
  getTelegramConfig,
  getTelegramLinkStatus,
  sendResumeToTelegram,
  type TelegramConfig,
} from '../../lib/api';
import type { ResumeData } from '../../types/resume';
import styles from './TelegramShare.module.css';

// After the first delivery the server hands back a signed chat token; with
// it the next sends go straight to the user's chat, no bot round-trip.
const CHAT_TOKEN_KEY = 'cvforge:telegram-chat';
const POLL_INTERVAL_MS = 2000;

const readChatToken = () => {
  try {
    return localStorage.getItem(CHAT_TOKEN_KEY);
  } catch {
    return null;
  }
};
const writeChatToken = (token: string | null) => {
  try {
    if (token) localStorage.setItem(CHAT_TOKEN_KEY, token);
    else localStorage.removeItem(CHAT_TOKEN_KEY);
  } catch {
    // storage unavailable (private mode) — the link flow still works
  }
};

let configPromise: Promise<TelegramConfig> | null = null;

type Phase =
  | { name: 'idle' }
  | { name: 'linking' }
  | { name: 'waiting'; url: string; qr: string; token: string }
  | { name: 'sending' }
  | { name: 'done'; direct: boolean }
  | { name: 'expired' }
  | { name: 'error' };

export default function TelegramShare({ data, disabled }: { data: ResumeData; disabled?: boolean }) {
  const { t } = useTranslation('common');
  const [enabled, setEnabled] = useState(false);
  const [phase, setPhase] = useState<Phase>({ name: 'idle' });
  const [linked, setLinked] = useState(() => Boolean(readChatToken()));
  const dataRef = useRef(data);
  dataRef.current = data;

  useEffect(() => {
    configPromise ??= getTelegramConfig().catch(() => ({ enabled: false }));
    let alive = true;
    void configPromise.then((config) => alive && setEnabled(config.enabled));
    return () => {
      alive = false;
    };
  }, []);

  // Poll while the user is in the bot; stop on close/unmount.
  useEffect(() => {
    if (phase.name !== 'waiting') return;
    const timer = setInterval(async () => {
      try {
        const status = await getTelegramLinkStatus(phase.token);
        if (status.state === 'delivered') {
          writeChatToken(status.chatToken);
          setLinked(true);
          setPhase({ name: 'done', direct: false });
        } else if (status.state === 'expired') {
          setPhase({ name: 'expired' });
        } else if (status.state === 'failed') {
          setPhase({ name: 'error' });
        }
      } catch {
        // transient network error — keep polling
      }
    }, POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [phase]);

  const startLinkFlow = async () => {
    setPhase({ name: 'linking' });
    try {
      const link = await createTelegramLink(dataRef.current);
      const qr = await QRCode.toDataURL(link.url, { margin: 1, width: 220 });
      setPhase({ name: 'waiting', url: link.url, qr, token: link.token });
    } catch {
      setPhase({ name: 'error' });
    }
  };

  const send = async () => {
    const chatToken = readChatToken();
    if (!chatToken) {
      await startLinkFlow();
      return;
    }
    setPhase({ name: 'sending' });
    try {
      await sendResumeToTelegram(chatToken, dataRef.current);
      setPhase({ name: 'done', direct: true });
    } catch (err) {
      // The bot was blocked or the token is stale: forget it, link again.
      if (err instanceof ApiError && (err.status === 401 || err.status === 410)) {
        writeChatToken(null);
        setLinked(false);
        await startLinkFlow();
      } else {
        setPhase({ name: 'error' });
      }
    }
  };

  const unlink = () => {
    writeChatToken(null);
    setLinked(false);
    setPhase({ name: 'idle' });
  };

  const close = () => setPhase({ name: 'idle' });

  if (!enabled) return null;

  const busy = phase.name === 'linking' || phase.name === 'sending';

  return (
    <>
      <Button variant="secondary" onClick={send} disabled={disabled || busy} title={disabled ? t('telegram.fillFirst') : undefined}>
        <span className={styles.planeIcon} aria-hidden="true">
          ✈️
        </span>
        {busy ? t('telegram.sending') : t('telegram.send')}
      </Button>

      {phase.name !== 'idle' &&
        phase.name !== 'linking' &&
        createPortal(
          <div className={`${styles.overlay} no-print`} onClick={phase.name === 'sending' ? undefined : close}>
            <div
              className={`${styles.card} telegram-card`}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={t('telegram.title')}
            >
              {phase.name !== 'sending' && (
                <button type="button" className={styles.close} onClick={close} aria-label={t('templateGallery.close')}>
                  ×
                </button>
              )}

              {phase.name === 'waiting' && (
                <>
                  <h2 className={styles.title}>{t('telegram.title')}</h2>
                  <ol className={styles.steps}>
                    <li>{t('telegram.step1')}</li>
                    <li>{t('telegram.step2')}</li>
                    <li>{t('telegram.step3')}</li>
                  </ol>
                  <a className={styles.openLink} href={phase.url} target="_blank" rel="noopener noreferrer">
                    <Button>{t('telegram.openBot')}</Button>
                  </a>
                  <div className={styles.qrBlock}>
                    <img src={phase.qr} alt="" width={160} height={160} className={styles.qr} />
                    <span className={styles.hint}>{t('telegram.scanQr')}</span>
                  </div>
                  <p className={styles.waiting}>
                    <Spinner /> {t('telegram.waiting')}
                  </p>
                </>
              )}

              {phase.name === 'sending' && (
                <p className={styles.waiting}>
                  <Spinner /> {t('telegram.sendingDirect')}
                </p>
              )}

              {phase.name === 'done' && (
                <div className={styles.result}>
                  <div className={styles.successIcon} aria-hidden="true">
                    ✓
                  </div>
                  <h2 className={styles.title}>{t('telegram.doneTitle')}</h2>
                  <p className={styles.hint}>{t(phase.direct ? 'telegram.doneDirect' : 'telegram.doneLinked')}</p>
                  <div className={styles.actions}>
                    <Button onClick={close}>{t('telegram.ok')}</Button>
                    {linked && (
                      <Button variant="ghost" onClick={unlink}>
                        {t('telegram.unlink')}
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {(phase.name === 'expired' || phase.name === 'error') && (
                <div className={styles.result}>
                  <h2 className={styles.title}>{t(phase.name === 'expired' ? 'telegram.expired' : 'telegram.error')}</h2>
                  <div className={styles.actions}>
                    <Button onClick={startLinkFlow}>{t('telegram.retry')}</Button>
                  </div>
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
