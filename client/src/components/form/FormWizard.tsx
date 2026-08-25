import { useState, type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './FormWizard.module.css';
import StepIndicator from './StepIndicator';
import PersonalInfoStep from './steps/PersonalInfoStep';
import ContactsStep from './steps/ContactsStep';
import ExperienceStep from './steps/ExperienceStep';
import EducationStep from './steps/EducationStep';
import SkillsStep from './steps/SkillsStep';
import LanguagesStep from './steps/LanguagesStep';
import ReviewAndGenerateStep from './steps/ReviewAndGenerateStep';
import type { StepComponentProps } from './stepTypes';

const STEP_KEYS = ['personal', 'contacts', 'experience', 'education', 'skills', 'languages', 'review'] as const;

const STEP_COMPONENTS: Record<(typeof STEP_KEYS)[number], ComponentType<StepComponentProps>> = {
  personal: PersonalInfoStep,
  contacts: ContactsStep,
  experience: ExperienceStep,
  education: EducationStep,
  skills: SkillsStep,
  languages: LanguagesStep,
  review: ReviewAndGenerateStep,
};

interface FormWizardProps {
  onFinish: () => void;
}

export default function FormWizard({ onFinish }: FormWizardProps) {
  const { t } = useTranslation('form');
  const [stepIndex, setStepIndex] = useState(0);

  const stepKey = STEP_KEYS[stepIndex];
  const StepComponent = STEP_COMPONENTS[stepKey];
  const isLast = stepIndex === STEP_KEYS.length - 1;

  const goNext = () => {
    if (isLast) {
      onFinish();
      return;
    }
    setStepIndex((i) => Math.min(i + 1, STEP_KEYS.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    setStepIndex((i) => Math.max(i - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles.wizard}>
      <StepIndicator
        steps={STEP_KEYS.map((key) => t(`steps.${key}`))}
        currentIndex={stepIndex}
        onStepClick={setStepIndex}
      />
      <div className={`${styles.stepBody} wizard-step-body`}>
        <StepComponent onNext={goNext} onBack={goBack} isFirst={stepIndex === 0} isLast={isLast} />
      </div>
    </div>
  );
}
