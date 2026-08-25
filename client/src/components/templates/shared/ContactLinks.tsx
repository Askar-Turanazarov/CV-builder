import type { ContactInfo } from '../../../types/resume';
import styles from './ContactLinks.module.css';

interface ContactLinksProps {
  contacts: ContactInfo;
  /**
   * 'plain' — real anchors, styled like inline text (used in Document mode
   * and as the default). 'buttons' — the same links as clickable pill
   * buttons with an icon (used in Site mode) — this is the actual
   * functional difference between the two view modes: contacts stop being
   * inert text and become a real "get in touch" call to action.
   */
  variant?: 'plain' | 'buttons';
  /**
   * 'default' assumes a light/neutral surface behind it (uses
   * --color-primary text on --color-accent-soft). 'inverted' is for
   * placement on a colored/dark surface (sidebars, banners, terminal
   * panels) — text inherits the surrounding color, and button pills use a
   * translucent white instead of the theme's light tint (which would be
   * nearly invisible on a saturated background).
   */
  tone?: 'default' | 'inverted';
  className?: string;
}

interface LinkItem {
  key: string;
  href: string | null;
  label: string;
  icon: string;
}

function normalizeUrl(value: string): string {
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function normalizeTelegram(value: string): string {
  const handle = value.trim().replace(/^@/, '').replace(/^https?:\/\/t\.me\//i, '');
  return `https://t.me/${handle}`;
}

function buildLinks(contacts: ContactInfo): LinkItem[] {
  const items: LinkItem[] = [];
  if (contacts.email) items.push({ key: 'email', href: `mailto:${contacts.email}`, label: contacts.email, icon: '✉' });
  if (contacts.phone) {
    items.push({ key: 'phone', href: `tel:${contacts.phone.replace(/[^+\d]/g, '')}`, label: contacts.phone, icon: '☎' });
  }
  if (contacts.location) items.push({ key: 'location', href: null, label: contacts.location, icon: '📍' });
  if (contacts.website) {
    items.push({ key: 'website', href: normalizeUrl(contacts.website), label: contacts.website, icon: '🔗' });
  }
  if (contacts.linkedin) {
    items.push({ key: 'linkedin', href: normalizeUrl(contacts.linkedin), label: contacts.linkedin, icon: 'in' });
  }
  if (contacts.telegram) {
    items.push({ key: 'telegram', href: normalizeTelegram(contacts.telegram), label: contacts.telegram, icon: '✈' });
  }
  if (contacts.github) {
    items.push({ key: 'github', href: normalizeUrl(contacts.github), label: contacts.github, icon: '⌥' });
  }
  return items;
}

export default function ContactLinks({ contacts, variant = 'plain', tone = 'default', className }: ContactLinksProps) {
  const links = buildLinks(contacts);
  if (links.length === 0) return null;

  const variantClass = variant === 'buttons' ? styles.buttons : styles.plain;
  const toneClass = tone === 'inverted' ? styles.inverted : '';

  return (
    <ul className={`${styles.list} ${variantClass} ${toneClass} contact-links ${className ?? ''}`.trim()}>
      {links.map((item) => (
        <li key={item.key}>
          {item.href ? (
            <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
              {variant === 'buttons' && (
                <span className={styles.icon} aria-hidden="true">
                  {item.icon}
                </span>
              )}
              {item.label}
            </a>
          ) : (
            <span>
              {variant === 'buttons' && (
                <span className={styles.icon} aria-hidden="true">
                  {item.icon}
                </span>
              )}
              {item.label}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
