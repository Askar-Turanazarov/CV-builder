import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useResumeStore } from '../../../store/resumeStore';
import { educationStepSchema, type EducationStepFormValues } from '../../../validation/resumeSchemas';
import FormField from '../../common/FormField';
import Button from '../../common/Button';
import WizardNav from '../WizardNav';
import fc from '../../common/formControls.module.css';
import layout from './StepLayout.module.css';
import type { StepComponentProps } from '../stepTypes';

function newEntry() {
  return {
    id: crypto.randomUUID(),
    institution: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: null as string | null,
    description: '',
  };
}

export default function EducationStep({ onNext, onBack, isFirst }: StepComponentProps) {
  const { t } = useTranslation(['form', 'common']);
  const data = useResumeStore((s) => s.data);
  const setEducation = useResumeStore((s) => s.setEducation);

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EducationStepFormValues>({
    resolver: zodResolver(educationStepSchema),
    defaultValues: { education: data.education },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'education' });

  // Live-preview sync — see PersonalInfoStep for the same pattern.
  useEffect(() => {
    const subscription = watch((values) => setEducation((values.education ?? []) as EducationStepFormValues['education']));
    return () => subscription.unsubscribe();
  }, [watch, setEducation]);

  const onSubmit = (values: EducationStepFormValues) => {
    setEducation(values.education);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <h2 className={layout.heading}>{t('steps.education')}</h2>

      {fields.length === 0 && <p className={layout.emptyState}>{t('education.empty')}</p>}

      {fields.map((field, index) => {
        const entryErrors = errors.education?.[index];
        return (
          <div key={field.id} className={layout.entryCard}>
            <div className={layout.entryHeader}>
              <span className={layout.entryTitle}>#{index + 1}</span>
              <Button type="button" variant="ghost" onClick={() => remove(index)}>
                {t('actions.remove', { ns: 'common' })}
              </Button>
            </div>

            <FormField
              label={t('education.institution.label')}
              htmlFor={`institution-${index}`}
              error={entryErrors?.institution?.message ? t(entryErrors.institution.message) : undefined}
            >
              <input id={`institution-${index}`} className={fc.input} {...register(`education.${index}.institution`)} />
            </FormField>

            <div className={`${fc.row} ${fc.row2}`}>
              <FormField
                label={t('education.degree.label')}
                htmlFor={`degree-${index}`}
                error={entryErrors?.degree?.message ? t(entryErrors.degree.message) : undefined}
              >
                <input id={`degree-${index}`} className={fc.input} {...register(`education.${index}.degree`)} />
              </FormField>
              <FormField label={t('education.fieldOfStudy.label')} htmlFor={`field-${index}`}>
                <input id={`field-${index}`} className={fc.input} {...register(`education.${index}.fieldOfStudy`)} />
              </FormField>
            </div>

            <div className={`${fc.row} ${fc.row2}`}>
              <FormField
                label={t('education.startDate.label')}
                htmlFor={`eduStart-${index}`}
                error={entryErrors?.startDate?.message ? t(entryErrors.startDate.message) : undefined}
              >
                <input id={`eduStart-${index}`} type="month" className={fc.input} {...register(`education.${index}.startDate`)} />
              </FormField>
              <FormField label={t('education.endDate.label')} htmlFor={`eduEnd-${index}`}>
                <input
                  id={`eduEnd-${index}`}
                  type="month"
                  className={fc.input}
                  value={watch(`education.${index}.endDate`) ?? ''}
                  onChange={(e) => setValue(`education.${index}.endDate`, e.target.value || null)}
                />
              </FormField>
            </div>

            <FormField label={t('education.description.label')} htmlFor={`eduDescription-${index}`}>
              <textarea id={`eduDescription-${index}`} className={fc.textarea} {...register(`education.${index}.description`)} />
            </FormField>
          </div>
        );
      })}

      <Button type="button" variant="secondary" className={layout.addButton} onClick={() => append(newEntry())}>
        + {t('education.addEntry')}
      </Button>

      <WizardNav onBack={onBack} isFirst={isFirst} />
    </form>
  );
}
