import { useMemo, type ReactNode } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import type { i18n as I18n } from 'i18next';
import type { UiLanguage } from '../../../types/resume';

const clones = new Map<string, I18n>();

/**
 * Gives a resume its own language without touching the interface: templates
 * call useTranslation as usual and get the resume's language from this
 * provider. Clones share the already-loaded resources, so they are ready at
 * once — which also matters for the headless print page, whose browser
 * would otherwise translate everything into its own (English) locale.
 */
export default function ResumeI18n({ lang, children }: { lang: UiLanguage; children: ReactNode }) {
  const { i18n } = useTranslation();
  const instance = useMemo(() => {
    if (i18n.language === lang) return i18n;
    let clone = clones.get(lang);
    if (!clone) {
      clone = i18n.cloneInstance({ lng: lang, initAsync: false });
      clones.set(lang, clone);
    }
    return clone;
  }, [i18n, i18n.language, lang]);

  return <I18nextProvider i18n={instance}>{children}</I18nextProvider>;
}
