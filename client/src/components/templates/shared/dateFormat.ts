import type { UiLanguage } from '../../../types/resume';

// Manual month-name tables instead of Intl.DateTimeFormat: browser ICU data
// for 'uz-Latn' is inconsistent (falls back to ugly "M03"-style tokens for
// month names), and this guarantees the same reviewed, native-quality
// wording in all three languages regardless of the visitor's browser.
const MONTH_ABBR: Record<UiLanguage, string[]> = {
  ru: ['янв.', 'февр.', 'март', 'апр.', 'май', 'июнь', 'июль', 'авг.', 'сент.', 'окт.', 'нояб.', 'дек.'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  uz: ['yan', 'fev', 'mart', 'apr', 'may', 'iyun', 'iyul', 'avg', 'sen', 'okt', 'noy', 'dek'],
};

const MONTH_FULL: Record<UiLanguage, string[]> = {
  ru: [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
  ],
  en: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  uz: ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'],
};

function parseYearMonth(value: string): { year: number; month: number } | null {
  const [year, month] = value.split('-').map(Number);
  if (!year || !month || month < 1 || month > 12) return null;
  return { year, month };
}

export function formatMonthYear(value: string, uiLanguage: UiLanguage): string {
  const parsed = parseYearMonth(value);
  if (!parsed) return value;
  return `${MONTH_ABBR[uiLanguage][parsed.month - 1]} ${parsed.year}`;
}

export function formatDateRange(
  start: string,
  end: string | null,
  uiLanguage: UiLanguage,
  presentLabel: string,
): string {
  const startLabel = start ? formatMonthYear(start, uiLanguage) : '';
  const endLabel = end ? formatMonthYear(end, uiLanguage) : presentLabel;
  return [startLabel, endLabel].filter(Boolean).join(' — ');
}

export function formatFullDate(value: string, uiLanguage: UiLanguage): string {
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day || month < 1 || month > 12) return value;
  const monthName = MONTH_FULL[uiLanguage][month - 1];
  if (uiLanguage === 'en') {
    return `${monthName} ${day}, ${year}`;
  }
  return `${day} ${monthName} ${year}`;
}
