import styles from './StepIndicator.module.css';

interface StepIndicatorProps {
  steps: string[];
  currentIndex: number;
  onStepClick: (index: number) => void;
}

export default function StepIndicator({ steps, currentIndex, onStepClick }: StepIndicatorProps) {
  return (
    <ol className={`${styles.list} step-indicator no-print`}>
      {steps.map((label, index) => {
        const state = index === currentIndex ? styles.current : index < currentIndex ? styles.done : styles.upcoming;
        return (
          <li key={label} className={styles.item}>
            <button
              type="button"
              className={`${styles.stepButton} ${state}`}
              onClick={() => index <= currentIndex && onStepClick(index)}
              disabled={index > currentIndex}
            >
              <span className={styles.badge}>{index + 1}</span>
              <span className={styles.label}>{label}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
