import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useResumeStore } from '../../../store/resumeStore';
import { experienceStepSchema, type ExperienceStepFormValues } from '../../../validation/resumeSchemas';
import FormField from '../../common/FormField';
import Button from '../../common/Button';
import WizardNav from '../WizardNav';
import fc from '../../common/formControls.module.css';
import layout from './StepLayout.module.css';
import type { StepComponentProps } from '../stepTypes';

function newEntry() {
  return {
    id: crypto.randomUUID(),
    company: '',
    position: '',
    startDate: '',
    endDate: null as string | null,
    isCurrent: false,
    location: '',
    description: '',
  };
}

export default function ExperienceStep({ onNext, onBack, isFirst }: StepComponentProps) {
  const { t } = useTranslation(['form', 'common']);
  const data = useResumeStore((s) => s.data);
  const setExperience = useResumeStore((s) => s.setExperience);

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ExperienceStepFormValues>({
    resolver: zodResolver(experienceStepSchema),
    defaultValues: { experience: data.experience },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'experience' });

  const onSubmit = (values: ExperienceStepFormValues) => {
    setExperience(values.experience);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <h2 className={layout.heading}>{t('steps.experience')}</h2>

      {fields.length === 0 && <p className={layout.emptyState}>{t('experience.empty')}</p>}

      {fields.map((field, index) => {
        const isCurrent = watch(`experience.${index}.isCurrent`);
        const entryErrors = errors.experience?.[index];
        return (
          <div key={field.id} className={layout.entryCard}>
            <div className={layout.entryHeader}>
              <span className={layout.entryTitle}>#{index + 1}</span>
              <Button type="button" variant="ghost" onClick={() => remove(index)}>
                {t('actions.remove', { ns: 'common' })}
              </Button>
            </div>

            <div className={`${fc.row} ${fc.row2}`}>
              <FormField
                label={t('experience.company.label')}
                htmlFor={`company-${index}`}
                error={entryErrors?.company?.message ? t(entryErrors.company.message) : undefined}
              >
                <input id={`company-${index}`} className={fc.input} {...register(`experience.${index}.company`)} />
              </FormField>
              <FormField
                label={t('experience.position.label')}
                htmlFor={`position-${index}`}
                error={entryErrors?.position?.message ? t(entryErrors.position.message) : undefined}
              >
                <input id={`position-${index}`} className={fc.input} {...register(`experience.${index}.position`)} />
              </FormField>
            </div>

            <div className={`${fc.row} ${fc.row3}`}>
              <FormField
                label={t('experience.startDate.label')}
                htmlFor={`start-${index}`}
                error={entryErrors?.startDate?.message ? t(entryErrors.startDate.message) : undefined}
              >
                <input id={`start-${index}`} type="month" className={fc.input} {...register(`experience.${index}.startDate`)} />
              </FormField>
              <FormField label={t('experience.endDate.label')} htmlFor={`end-${index}`}>
                <input
                  id={`end-${index}`}
                  type="month"
                  className={fc.input}
                  disabled={isCurrent}
                  value={watch(`experience.${index}.endDate`) ?? ''}
                  onChange={(e) => setValue(`experience.${index}.endDate`, e.target.value || null)}
                />
              </FormField>
              <FormField label={t('experience.location.label')} htmlFor={`location-${index}`}>
                <input id={`location-${index}`} className={fc.input} {...register(`experience.${index}.location`)} />
              </FormField>
            </div>

            <label className={fc.checkboxRow}>
              <input
                type="checkbox"
                checked={isCurrent}
                onChange={(e) => {
                  setValue(`experience.${index}.isCurrent`, e.target.checked);
                  if (e.target.checked) setValue(`experience.${index}.endDate`, null);
                }}
              />
              {t('experience.isCurrent.label')}
            </label>

            <FormField
              label={t('experience.description.label')}
              htmlFor={`description-${index}`}
              error={entryErrors?.description?.message ? t(entryErrors.description.message) : undefined}
            >
              <textarea
                id={`description-${index}`}
                className={fc.textarea}
                placeholder={t('experience.description.placeholder')}
                {...register(`experience.${index}.description`)}
              />
            </FormField>
          </div>
        );
      })}

      <Button type="button" variant="secondary" className={layout.addButton} onClick={() => append(newEntry())}>
        + {t('experience.addEntry')}
      </Button>

      <WizardNav onBack={onBack} isFirst={isFirst} />
    </form>
  );
}
