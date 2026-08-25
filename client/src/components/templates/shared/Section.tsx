import type { ReactNode } from 'react';

interface SectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export default function Section({ title, children, className }: SectionProps) {
  return (
    <section className={`resume-section ${className ?? ''}`.trim()}>
      <h3>{title}</h3>
      {children}
    </section>
  );
}
