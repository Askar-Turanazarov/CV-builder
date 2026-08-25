import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import commonRu from './locales/ru/common.json';
import formRu from './locales/ru/form.json';
import templatesRu from './locales/ru/templates.json';
import commonEn from './locales/en/common.json';
import formEn from './locales/en/form.json';
import templatesEn from './locales/en/templates.json';
import commonUz from './locales/uz/common.json';
import formUz from './locales/uz/form.json';
import templatesUz from './locales/uz/templates.json';

export const resources = {
  ru: { common: commonRu, form: formRu, templates: templatesRu },
  en: { common: commonEn, form: formEn, templates: templatesEn },
  uz: { common: commonUz, form: formUz, templates: templatesUz },
} as const;

// Only used to guess a sensible language on a visitor's very first
// load — after that, App.tsx keeps i18next in sync with the persisted
// uiLanguage field on resumeStore, which is the single source of truth.
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ru',
    supportedLngs: ['ru', 'en', 'uz'],
    ns: ['common', 'form', 'templates'],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    detection: {
      order: ['navigator'],
      caches: [],
    },
  });

export default i18n;
