import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useResumeStore } from '../../../store/resumeStore';
import { contactsSchema, type ContactsFormValues } from '../../../validation/resumeSchemas';
import FormField from '../../common/FormField';
import WizardNav from '../WizardNav';
import fc from '../../common/formControls.module.css';
import layout from './StepLayout.module.css';
import type { StepComponentProps } from '../stepTypes';

export default function ContactsStep({ onNext, onBack, isFirst }: StepComponentProps) {
  const { t } = useTranslation('form');
  const data = useResumeStore((s) => s.data);
  const setContacts = useResumeStore((s) => s.setContacts);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ContactsFormValues>({
    resolver: zodResolver(contactsSchema),
    defaultValues: data.contacts,
  });

  // Live-preview sync — see PersonalInfoStep for the same pattern.
  useEffect(() => {
    const subscription = watch((values) => setContacts(values as ContactsFormValues));
    return () => subscription.unsubscribe();
  }, [watch, setContacts]);

  const onSubmit = (values: ContactsFormValues) => {
    setContacts(values);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <h2 className={layout.heading}>{t('steps.contacts')}</h2>

      <div className={`${fc.row} ${fc.row2}`}>
        <FormField
          label={t('contacts.email.label')}
          htmlFor="email"
          error={errors.email?.message ? t(errors.email.message) : undefined}
        >
          <input
            id="email"
            type="email"
            className={fc.input}
            placeholder={t('contacts.email.placeholder')}
            {...register('email')}
          />
        </FormField>
        <FormField
          label={t('contacts.phone.label')}
          htmlFor="phone"
          error={errors.phone?.message ? t(errors.phone.message) : undefined}
        >
          <input id="phone" className={fc.input} placeholder={t('contacts.phone.placeholder')} {...register('phone')} />
        </FormField>
      </div>

      <FormField
        label={t('contacts.location.label')}
        htmlFor="location"
        error={errors.location?.message ? t(errors.location.message) : undefined}
      >
        <input
          id="location"
          className={fc.input}
          placeholder={t('contacts.location.placeholder')}
          {...register('location')}
        />
      </FormField>

      <div className={`${fc.row} ${fc.row2}`}>
        <FormField label={t('contacts.website.label')} htmlFor="website">
          <input id="website" className={fc.input} placeholder={t('contacts.website.placeholder')} {...register('website')} />
        </FormField>
        <FormField label={t('contacts.linkedin.label')} htmlFor="linkedin">
          <input id="linkedin" className={fc.input} {...register('linkedin')} />
        </FormField>
      </div>

      <div className={`${fc.row} ${fc.row2}`}>
        <FormField label={t('contacts.telegram.label')} htmlFor="telegram">
          <input id="telegram" className={fc.input} {...register('telegram')} />
        </FormField>
        <FormField label={t('contacts.github.label')} htmlFor="github">
          <input id="github" className={fc.input} {...register('github')} />
        </FormField>
      </div>

      <WizardNav onBack={onBack} isFirst={isFirst} />
    </form>
  );
}
