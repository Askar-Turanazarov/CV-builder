import type { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

export default function Button({ variant = 'primary', className, ...rest }: ButtonProps) {
  const variantClass = variant === 'primary' ? styles.primary : variant === 'secondary' ? styles.secondary : styles.ghost;
  // Plain (non-module) markers so styles/glass.css can restyle every button
  // when the Apple Glass design system is active, regardless of module hash.
  const glassMarkers = `btn btn-${variant}`;
  return (
    <button className={[styles.button, variantClass, glassMarkers, className].filter(Boolean).join(' ')} {...rest} />
  );
}
