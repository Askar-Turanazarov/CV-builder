/**
 * Link-preview meta (Telegram, WhatsApp, Slack, social networks). Crawlers
 * don't run JS, so each language gets its own static HTML: index.html (ru,
 * the default) plus index.en.html / index.uz.html, which vercel.json serves
 * for ?lang=en / ?lang=uz.
 */
export const SITE_URL = 'https://cv-builder-askar.vercel.app';

export const META = {
  ru: {
    locale: 'ru_RU',
    title: 'CV Forge — конструктор резюме и портфолио',
    description:
      'Резюме и портфолио за пару минут: ИИ напишет описание, 40 шаблонов, экспорт в PDF и отправка в Telegram. Бесплатно.',
  },
  en: {
    locale: 'en_US',
    title: 'CV Forge — resume and portfolio builder',
    description:
      'A resume and portfolio in minutes: AI writes your summary, 40 templates, PDF export and delivery to Telegram. Free.',
  },
  uz: {
    locale: 'uz_UZ',
    title: 'CV Forge — rezyume va portfolio konstruktori',
    description:
      "Bir necha daqiqada rezyume va portfolio: AI tavsifni yozadi, 40 ta shablon, PDF eksport va Telegramga yuborish. Bepul.",
  },
} as const;

export type MetaLang = keyof typeof META;

function escape(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

export function metaTags(lang: MetaLang): string {
  const m = META[lang];
  const url = lang === 'ru' ? `${SITE_URL}/` : `${SITE_URL}/?lang=${lang}`;
  const image = `${SITE_URL}/og/og-${lang}.jpg`;
  const alternates = (Object.keys(META) as MetaLang[])
    .map((l) => `<link rel="alternate" hreflang="${l}" href="${l === 'ru' ? `${SITE_URL}/` : `${SITE_URL}/?lang=${l}`}" />`)
    .join('\n    ');
  return `<title>${escape(m.title)}</title>
    <meta name="description" content="${escape(m.description)}" />
    <link rel="canonical" href="${url}" />
    ${alternates}
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="CV Forge" />
    <meta property="og:locale" content="${m.locale}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${escape(m.title)}" />
    <meta property="og:description" content="${escape(m.description)}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escape(m.title)}" />
    <meta name="twitter:description" content="${escape(m.description)}" />
    <meta name="twitter:image" content="${image}" />`;
}
