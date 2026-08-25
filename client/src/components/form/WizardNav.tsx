import { useTranslation } from 'react-i18next';
import Button from '../common/Button';
import styles from './WizardNav.module.css';

interface WizardNavProps {
  onBack?: () => void;
  isFirst: boolean;
  nextLabel?: string;
  nextDisabled?: boolean;
}

export default function WizardNav({ onBack, isFirst, nextLabel, nextDisabled }: WizardNavProps) {
  const { t } = useTranslation('common');
  return (
    <div className={`${styles.nav} no-print`}>
      {!isFirst && (
        <Button type="button" variant="secondary" onClick={onBack}>
          {t('actions.back')}
        </Button>
      )}
      <Button type="submit" disabled={nextDisabled} className={styles.nextButton}>
        {nextLabel ?? t('actions.next')}
      </Button>
    </div>
  );
}
