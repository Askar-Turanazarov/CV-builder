import type { ReactNode } from 'react';
import { useSlidingIndicator } from '../../hooks/useSlidingIndicator';
import styles from './SegmentedControl.module.css';

interface SegmentedOption<T extends string> {
  value: T;
  label: ReactNode;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  className?: string;
}

/** Pill group with an indicator that slides to the selected option. */
export default function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  className = '',
}: SegmentedControlProps<T>) {
  const { containerRef, indicatorStyle, ready } = useSlidingIndicator<HTMLDivElement>(value);

  return (
    <div
      ref={containerRef}
      className={`${styles.group} segmented no-print ${className}`}
      data-ready={ready || undefined}
      role="group"
      aria-label={ariaLabel}
    >
      <span className={`${styles.indicator} segmented-indicator`} style={indicatorStyle} aria-hidden="true" />
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`${styles.item} segmented-item`}
          data-active={option.value === value}
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
