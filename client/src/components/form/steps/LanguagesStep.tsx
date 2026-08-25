import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useResumeStore } from '../../../store/resumeStore';
import type { LanguageEntry, LanguageLevel } from '../../../types/resume';
import Button from '../../common/Button';
import WizardNav from '../WizardNav';
import fc from '../../common/formControls.module.css';
import layout from './StepLayout.module.css';
import type { StepComponentProps } from '../stepTypes';

const LEVELS: LanguageLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'native'];

export default function LanguagesStep({ onNext, onBack, isFirst }: StepComponentProps) {
  const { t } = useTranslation(['form', 'common']);
  const data = useResumeStore((s) => s.data);
  const setLanguages = useResumeStore((s) => s.setLanguages);

  const [languages, setLocalLanguages] = useState<LanguageEntry[]>(data.languages);
  const [name, setName] = useState('');
  const [level, setLevel] = useState<LanguageLevel>('B1');
  const [error, setError] = useState<string | null>(null);

  const addLanguage = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setLocalLanguages((prev) => [...prev, { id: crypto.randomUUID(), name: trimmed, level }]);
    setName('');
    setError(null);
  };

  const removeLanguage = (id: string) => {
    setLocalLanguages((prev) => prev.filter((l) => l.id !== id));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (languages.length === 0) {
      setError(t('validation.required'));
      return;
    }
    setLanguages(languages);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2 className={layout.heading}>{t('steps.languages')}</h2>

      <div className={layout.inlineAddRow}>
        <input
          className={fc.input}
          placeholder={t('languages.name.placeholder')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addLanguage();
            }
          }}
        />
        <select className={fc.select} value={level} onChange={(e) => setLevel(e.target.value as LanguageLevel)}>
          {LEVELS.map((lvl) => (
            <option key={lvl} value={lvl}>
              {t(`languages.levels.${lvl}`)}
            </option>
          ))}
        </select>
        <Button type="button" variant="secondary" onClick={addLanguage}>
          {t('actions.add', { ns: 'common' })}
        </Button>
      </div>

      {languages.length === 0 ? (
        <p className={layout.emptyState}>{t('languages.empty')}</p>
      ) : (
        <ul className={layout.tagList}>
          {languages.map((lang) => (
            <li key={lang.id} className={layout.tag}>
              {lang.name} · {t(`languages.levels.${lang.level}`)}
              <button
                type="button"
                className={layout.tagRemove}
                onClick={() => removeLanguage(lang.id)}
                aria-label={t('actions.remove', { ns: 'common' })}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
      {error && <p role="alert">{error}</p>}

      <WizardNav onBack={onBack} isFirst={isFirst} />
    </form>
  );
}
