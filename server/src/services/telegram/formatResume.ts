import type { ExportPdfRequest } from '../../schemas/exportPdfRequest.schema.js';

type Lang = ExportPdfRequest['uiLanguage'];

const LABELS: Record<Lang, Record<string, string>> = {
  ru: {
    summary: 'О себе',
    strengths: 'Сильные стороны',
    experience: 'Опыт работы',
    education: 'Образование',
    skills: 'Навыки',
    languages: 'Языки',
    present: 'по настоящее время',
    native: 'родной',
    caption: 'Резюме в PDF — готово к отправке работодателю',
    footer: 'Собрано в CV Forge',
  },
  en: {
    summary: 'About',
    strengths: 'Strengths',
    experience: 'Experience',
    education: 'Education',
    skills: 'Skills',
    languages: 'Languages',
    present: 'present',
    native: 'native',
    caption: 'Your resume as PDF — ready to send to employers',
    footer: 'Made with CV Forge',
  },
  uz: {
    summary: 'O‘zim haqimda',
    strengths: 'Kuchli tomonlar',
    experience: 'Ish tajribasi',
    education: 'Ta’lim',
    skills: 'Ko‘nikmalar',
    languages: 'Tillar',
    present: 'hozirgacha',
    native: 'ona tili',
    caption: 'PDF rezyume — ish beruvchiga yuborishga tayyor',
    footer: 'CV Forge’da tayyorlangan',
  },
};

const LOCALES: Record<Lang, string> = { ru: 'ru-RU', en: 'en-US', uz: 'uz-Latn-UZ' };

// Telegram's HTML mode only needs these three escaped.
export function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function formatMonth(value: string, lang: Lang): string {
  const match = /^(\d{4})-(\d{2})/.exec(value);
  if (!match) return value;
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, 1));
  return new Intl.DateTimeFormat(LOCALES[lang], { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(date);
}

function formatRange(start: string, end: string | null, lang: Lang): string {
  const from = start ? formatMonth(start, lang) : '';
  const to = end ? formatMonth(end, lang) : LABELS[lang].present;
  return from ? `${from} — ${to}` : to;
}

const MESSAGE_LIMIT = 4096;

/**
 * The resume as a Telegram HTML message: a readable card on its own, sent
 * next to the PDF. Built from blocks so a long resume is cut between
 * sections (never mid-tag) to stay under Telegram's 4096-char limit.
 */
export function formatResumeMessage(resume: ExportPdfRequest): string {
  // The card is part of the resume, so it follows the resume's language
  const lang = resume.resumeLanguage ?? resume.uiLanguage;
  const l = LABELS[lang];
  const { personalInfo: info, contacts } = resume;
  const blocks: string[] = [];

  const head = [`<b>${escapeHtml(info.fullName || '—')}</b>`];
  if (info.jobTitle) head.push(`<i>${escapeHtml(info.jobTitle)}</i>`);
  blocks.push(head.join('\n'));

  const contactLines = [
    contacts.location && `📍 ${escapeHtml(contacts.location)}`,
    contacts.email && `✉️ ${escapeHtml(contacts.email)}`,
    contacts.phone && `📱 ${escapeHtml(contacts.phone)}`,
    contacts.telegram && `💬 ${escapeHtml(contacts.telegram)}`,
    contacts.linkedin && `🔗 ${escapeHtml(contacts.linkedin)}`,
    contacts.github && `🐙 ${escapeHtml(contacts.github)}`,
    contacts.website && `🌐 ${escapeHtml(contacts.website)}`,
  ].filter(Boolean);
  if (contactLines.length > 0) blocks.push(contactLines.join('\n'));

  if (resume.aiContent?.summary) {
    blocks.push(`📝 <b>${l.summary}</b>\n${escapeHtml(resume.aiContent.summary)}`);
  }

  if (resume.aiContent && resume.aiContent.strengths.length > 0) {
    blocks.push(
      `💪 <b>${l.strengths}</b>\n${resume.aiContent.strengths.map((s) => `• ${escapeHtml(s)}`).join('\n')}`,
    );
  }

  if (resume.experience.length > 0) {
    const items = resume.experience.map((exp) => {
      const lines = [
        `▸ <b>${escapeHtml(exp.position)}</b> — ${escapeHtml(exp.company)}`,
        `   <i>${escapeHtml(formatRange(exp.startDate, exp.isCurrent ? null : exp.endDate, lang))}${
          exp.location ? ` · ${escapeHtml(exp.location)}` : ''
        }</i>`,
      ];
      if (exp.description) lines.push(escapeHtml(exp.description.trim()));
      return lines.join('\n');
    });
    blocks.push(`💼 <b>${l.experience}</b>\n${items.join('\n\n')}`);
  }

  if (resume.education.length > 0) {
    const items = resume.education.map((edu) => {
      const degree = [edu.degree, edu.fieldOfStudy].filter(Boolean).join(', ');
      return [
        `▸ <b>${escapeHtml(edu.institution)}</b>`,
        degree && `   ${escapeHtml(degree)}`,
        `   <i>${escapeHtml(formatRange(edu.startDate, edu.endDate, lang))}</i>`,
      ]
        .filter(Boolean)
        .join('\n');
    });
    blocks.push(`🎓 <b>${l.education}</b>\n${items.join('\n\n')}`);
  }

  if (resume.skills.length > 0) {
    blocks.push(`🛠 <b>${l.skills}</b>\n${resume.skills.map((s) => escapeHtml(s.name)).join(' · ')}`);
  }

  if (resume.languages.length > 0) {
    const items = resume.languages.map(
      (item) => `${escapeHtml(item.name)} — ${item.level === 'native' ? l.native : item.level}`,
    );
    blocks.push(`🌍 <b>${l.languages}</b>\n${items.join(' · ')}`);
  }

  const footer = `\n\n<i>${l.footer}</i>`;
  let message = '';
  for (const block of blocks) {
    const next = message ? `${message}\n\n${block}` : block;
    if (next.length + footer.length > MESSAGE_LIMIT) break;
    message = next;
  }
  return message + footer;
}

export function documentCaption(resume: ExportPdfRequest): string {
  return `📄 ${LABELS[resume.resumeLanguage ?? resume.uiLanguage].caption}`;
}

/** e.g. "Aigul_Rakhimova_CV.pdf"; Telegram shows the name as-is. */
export function documentFilename(resume: ExportPdfRequest): string {
  const name = resume.personalInfo.fullName.trim().replace(/[^\p{L}\p{N}]+/gu, '_').replace(/^_|_$/g, '');
  return `${name || 'resume'}_CV.pdf`;
}

const BOT_TEXTS: Record<Lang, Record<'welcome' | 'expired' | 'preparing' | 'failed', string>> = {
  ru: {
    welcome:
      '👋 Привет! Я присылаю резюме из <b>CV Forge</b>.\n\nОткройте предпросмотр резюме на сайте и нажмите «Отправить в Telegram» — PDF придёт сюда.',
    expired: '⌛ Ссылка устарела или уже использована. Нажмите «Отправить в Telegram» на сайте ещё раз.',
    preparing: '⏳ Готовлю ваше резюме, это займёт несколько секунд…',
    failed: '😔 Не получилось собрать PDF. Попробуйте, пожалуйста, ещё раз с сайта.',
  },
  en: {
    welcome:
      '👋 Hi! I deliver resumes from <b>CV Forge</b>.\n\nOpen your resume preview on the site and tap “Send to Telegram” — the PDF will arrive here.',
    expired: '⌛ This link has expired or was already used. Tap “Send to Telegram” on the site again.',
    preparing: '⏳ Preparing your resume, this takes a few seconds…',
    failed: '😔 Couldn’t build the PDF. Please try again from the site.',
  },
  uz: {
    welcome:
      '👋 Salom! Men <b>CV Forge</b>dan rezyumelarni yuboraman.\n\nSaytda rezyume ko‘rinishini oching va «Telegramga yuborish» tugmasini bosing — PDF shu yerga keladi.',
    expired: '⌛ Havola eskirgan yoki allaqachon ishlatilgan. Saytda «Telegramga yuborish» tugmasini qayta bosing.',
    preparing: '⏳ Rezyumeni tayyorlayapman, bir necha soniya…',
    failed: '😔 PDF tayyorlab bo‘lmadi. Iltimos, saytdan qayta urinib ko‘ring.',
  },
};

export function botText(lang: string | undefined, key: keyof (typeof BOT_TEXTS)['ru']): string {
  const normalized: Lang = lang?.startsWith('uz') ? 'uz' : lang?.startsWith('en') ? 'en' : 'ru';
  return BOT_TEXTS[normalized][key];
}

export function resumeBotText(resume: ExportPdfRequest, key: keyof (typeof BOT_TEXTS)['ru']): string {
  return BOT_TEXTS[resume.uiLanguage][key];
}
