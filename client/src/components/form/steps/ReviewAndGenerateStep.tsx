import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useResumeStore } from '../../../store/resumeStore';
import { useAiGeneration } from '../../../hooks/useAiGeneration';
import type { GenerateResumeRequestBody } from '../../../lib/api';
import type { ResumeData } from '../../../types/resume';
import Button from '../../common/Button';
import Spinner from '../../common/Spinner';
import ErrorBanner from '../../common/ErrorBanner';
import FormField from '../../common/FormField';
import WizardNav from '../WizardNav';
import fc from '../../common/formControls.module.css';
import layout from './StepLayout.module.css';
import type { StepComponentProps } from '../stepTypes';

function buildRequestBody(data: ResumeData): GenerateResumeRequestBody {
  return {
    uiLanguage: data.uiLanguage,
    jobTitle: data.personalInfo.jobTitle,
    experience: data.experience.map((e) => ({
      position: e.position,
      company: e.company,
      startDate: e.startDate,
      endDate: e.endDate,
      description: e.description,
    })),
    education: data.education.map((e) => ({
      institution: e.institution,
      degree: e.degree,
      fieldOfStudy: e.fieldOfStudy,
    })),
    skills: data.skills.map((s) => s.name),
    languages: data.languages.map((l) => ({ name: l.name, level: l.level })),
  };
}

export default function ReviewAndGenerateStep({ onNext, onBack, isFirst }: StepComponentProps) {
  const { t } = useTranslation(['form', 'common']);
  const data = useResumeStore((s) => s.data);
  const setAiContent = useResumeStore((s) => s.setAiContent);
  const { status, error, generate } = useAiGeneration();

  const [summary, setSummary] = useState(data.aiContent?.summary ?? '');
  const [strengths, setStrengths] = useState<string[]>(data.aiContent?.strengths ?? []);
  const hasContent = summary.trim().length > 0 || strengths.length > 0;

  const persistEdits = (nextSummary: string, nextStrengths: string[]) => {
    if (data.aiContent) {
      setAiContent({ ...data.aiContent, summary: nextSummary, strengths: nextStrengths });
    }
  };

  const handleGenerate = async () => {
    const result = await generate(buildRequestBody(data));
    if (result) {
      setSummary(result.summary);
      setStrengths(result.strengths);
      setAiContent(result);
    }
  };

  const handleSummaryChange = (value: string) => {
    setSummary(value);
    persistEdits(value, strengths);
  };

  const updateStrength = (index: number, value: string) => {
    setStrengths((prev) => {
      const next = [...prev];
      next[index] = value;
      persistEdits(summary, next);
      return next;
    });
  };

  const removeStrength = (index: number) => {
    setStrengths((prev) => {
      const next = prev.filter((_, i) => i !== index);
      persistEdits(summary, next);
      return next;
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2 className={layout.heading}>{t('review.title')}</h2>
      <p className={layout.subtitle}>{t('review.subtitle')}</p>

      <div className={layout.generateRow}>
        <Button type="button" onClick={handleGenerate} disabled={status === 'loading'}>
          {status === 'loading' ? (
            <>
              <Spinner /> {t('actions.generating', { ns: 'common' })}
            </>
          ) : hasContent ? (
            t('actions.regenerateAi', { ns: 'common' })
          ) : (
            t('actions.generateAi', { ns: 'common' })
          )}
        </Button>
      </div>

      {error && <ErrorBanner message={error} />}

      {!hasContent && status !== 'loading' && !error && <p className={layout.emptyState}>{t('review.aiIdleHint')}</p>}

      {hasContent && (
        <>
          <FormField label={t('review.summaryLabel')} htmlFor="ai-summary" hint={t('review.editHint')}>
            <textarea
              id="ai-summary"
              className={fc.textarea}
              value={summary}
              onChange={(e) => handleSummaryChange(e.target.value)}
              rows={5}
            />
          </FormField>

          <FormField label={t('review.strengthsLabel')} htmlFor="ai-strengths-0">
            <div>
              {strengths.map((strength, index) => (
                <div key={index} className={`${layout.inlineAddRow} ${layout.strengthRow}`}>
                  <input
                    id={index === 0 ? 'ai-strengths-0' : undefined}
                    className={fc.input}
                    value={strength}
                    onChange={(e) => updateStrength(index, e.target.value)}
                  />
                  <Button type="button" variant="ghost" onClick={() => removeStrength(index)}>
                    {t('actions.remove', { ns: 'common' })}
                  </Button>
                </div>
              ))}
            </div>
          </FormField>
        </>
      )}

      <WizardNav onBack={onBack} isFirst={isFirst} nextLabel={t('actions.finish', { ns: 'common' })} />
    </form>
  );
}
