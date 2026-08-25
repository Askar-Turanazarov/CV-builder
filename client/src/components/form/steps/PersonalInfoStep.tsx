import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useResumeStore } from '../../../store/resumeStore';
import { personalInfoSchema, type PersonalInfoFormValues } from '../../../validation/resumeSchemas';
import { usePhotoUpload } from '../../../hooks/usePhotoUpload';
import FormField from '../../common/FormField';
import PhotoUpload from '../../common/PhotoUpload';
import WizardNav from '../WizardNav';
import fc from '../../common/formControls.module.css';
import layout from './StepLayout.module.css';
import type { StepComponentProps } from '../stepTypes';

export default function PersonalInfoStep({ onNext, isFirst }: StepComponentProps) {
  const { t } = useTranslation('form');
  const data = useResumeStore((s) => s.data);
  const setPersonalInfo = useResumeStore((s) => s.setPersonalInfo);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: data.personalInfo,
  });

  const photo = watch('photo');
  const { handleFile, isProcessing, error: photoError } = usePhotoUpload((dataUrl) => {
    setValue('photo', dataUrl, { shouldValidate: true });
  });

  const onSubmit = (values: PersonalInfoFormValues) => {
    setPersonalInfo(values);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <h2 className={layout.heading}>{t('steps.personal')}</h2>

      <FormField label={t('personal.photo.label')} htmlFor="photo" hint={t('personal.photo.hint')}>
        <PhotoUpload photo={photo} onFileSelected={handleFile} isProcessing={isProcessing} error={photoError} />
      </FormField>

      <FormField
        label={t('personal.fullName.label')}
        htmlFor="fullName"
        error={errors.fullName?.message ? t(errors.fullName.message) : undefined}
      >
        <input
          id="fullName"
          className={fc.input}
          placeholder={t('personal.fullName.placeholder')}
          {...register('fullName')}
        />
      </FormField>

      <FormField
        label={t('personal.jobTitle.label')}
        htmlFor="jobTitle"
        error={errors.jobTitle?.message ? t(errors.jobTitle.message) : undefined}
      >
        <input
          id="jobTitle"
          className={fc.input}
          placeholder={t('personal.jobTitle.placeholder')}
          {...register('jobTitle')}
        />
      </FormField>

      <FormField
        label={t('personal.birthDate.label')}
        htmlFor="birthDate"
        error={errors.birthDate?.message ? t(errors.birthDate.message) : undefined}
      >
        <input id="birthDate" type="date" className={fc.input} {...register('birthDate')} />
      </FormField>

      <WizardNav isFirst={isFirst} />
    </form>
  );
}
