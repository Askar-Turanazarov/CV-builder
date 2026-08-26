import { useEffect, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useResumeStore } from '../../../store/resumeStore';
import type { SkillEntry } from '../../../types/resume';
import Button from '../../common/Button';
import WizardNav from '../WizardNav';
import fc from '../../common/formControls.module.css';
import layout from './StepLayout.module.css';
import type { StepComponentProps } from '../stepTypes';

const LEVELS = [1, 2, 3, 4, 5] as const;

export default function SkillsStep({ onNext, onBack, isFirst }: StepComponentProps) {
  const { t } = useTranslation(['form', 'common']);
  const data = useResumeStore((s) => s.data);
  const setSkills = useResumeStore((s) => s.setSkills);

  const [skills, setLocalSkills] = useState<SkillEntry[]>(data.skills);
  const [name, setName] = useState('');
  const [level, setLevel] = useState<(typeof LEVELS)[number]>(3);
  const [error, setError] = useState<string | null>(null);

  // Live-preview sync — this step has no react-hook-form instance to
  // `watch()` (skills are plain local state), so we mirror the local array
  // into the store directly whenever it changes, same intent as the
  // watch()-based steps elsewhere.
  useEffect(() => {
    setSkills(skills);
  }, [skills, setSkills]);

  const addSkill = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setLocalSkills((prev) => [...prev, { id: crypto.randomUUID(), name: trimmed, level }]);
    setName('');
    setError(null);
  };

  const removeSkill = (id: string) => {
    setLocalSkills((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (skills.length === 0) {
      setError(t('validation.required'));
      return;
    }
    setSkills(skills);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2 className={layout.heading}>{t('steps.skills')}</h2>

      <div className={layout.inlineAddRow}>
        <input
          className={fc.input}
          placeholder={t('skills.name.placeholder')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addSkill();
            }
          }}
        />
        <select
          className={fc.select}
          value={level}
          onChange={(e) => setLevel(Number(e.target.value) as (typeof LEVELS)[number])}
        >
          {LEVELS.map((lvl) => (
            <option key={lvl} value={lvl}>
              {t(`skills.levels.${lvl}`)}
            </option>
          ))}
        </select>
        <Button type="button" variant="secondary" onClick={addSkill}>
          {t('actions.add', { ns: 'common' })}
        </Button>
      </div>

      {skills.length === 0 ? (
        <p className={layout.emptyState}>{t('skills.empty')}</p>
      ) : (
        <ul className={layout.tagList}>
          {skills.map((skill) => (
            <li key={skill.id} className={layout.tag}>
              {skill.name}
              {skill.level ? ` · ${t(`skills.levels.${skill.level}`)}` : ''}
              <button
                type="button"
                className={layout.tagRemove}
                onClick={() => removeSkill(skill.id)}
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
