import type { UiLanguage } from '../types/resume';

type SampleName = { gender: 'f' | 'm'; ru: string; en: string; uz?: string };

/**
 * Example names for the "Full name" placeholder: Uzbek names plus mixed
 * ones (first name and surname from different nations), which are common
 * in Uzbekistan. `uz` falls back to `en` when the spelling is the same.
 */
const NAMES: SampleName[] = [
  { gender: 'f', ru: 'Айгерим Нурланова', en: 'Aigerim Nurlanova', uz: 'Aygerim Nurlanova' },
  { gender: 'f', ru: 'Дилноза Каримова', en: 'Dilnoza Karimova' },
  { gender: 'f', ru: 'Мадина Юсупова', en: 'Madina Yusupova' },
  { gender: 'f', ru: 'Нигора Рахимова', en: 'Nigora Rakhimova', uz: 'Nigora Rahimova' },
  { gender: 'f', ru: 'Шахзода Алимова', en: 'Shakhzoda Alimova', uz: 'Shahzoda Alimova' },
  { gender: 'f', ru: 'Севара Ташпулатова', en: 'Sevara Tashpulatova', uz: 'Sevara Toshpoʻlatova' },
  { gender: 'm', ru: 'Жасур Нурматов', en: 'Jasur Nurmatov' },
  { gender: 'm', ru: 'Бехзод Хамидов', en: 'Behzod Khamidov', uz: 'Behzod Hamidov' },
  { gender: 'm', ru: 'Сардор Абдуллаев', en: 'Sardor Abdullaev', uz: 'Sardor Abdullayev' },
  { gender: 'm', ru: 'Отабек Исмоилов', en: 'Otabek Ismoilov' },
  { gender: 'm', ru: 'Азиз Мирзаев', en: 'Aziz Mirzaev', uz: 'Aziz Mirzayev' },
  // Mixed
  { gender: 'm', ru: 'Владимир Джанибеков', en: 'Vladimir Dzhanibekov', uz: 'Vladimir Jonibekov' },
  { gender: 'f', ru: 'Алина Усманова', en: 'Alina Usmanova' },
  { gender: 'm', ru: 'Рустам Ковалёв', en: 'Rustam Kovalev', uz: 'Rustam Kovalyov' },
  { gender: 'f', ru: 'Диана Ким', en: 'Diana Kim' },
  { gender: 'm', ru: 'Эльдар Петров', en: 'Eldar Petrov' },
];

const pick = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)];

// Chosen once per page load, so the hint stays put while moving between steps
const first = pick(NAMES);
const second = pick(NAMES.filter((n) => n.gender !== first.gender));

export function getSampleNames(lang: UiLanguage): [string, string] {
  const spell = (n: SampleName) => (lang === 'ru' ? n.ru : lang === 'uz' ? (n.uz ?? n.en) : n.en);
  return [spell(first), spell(second)];
}
