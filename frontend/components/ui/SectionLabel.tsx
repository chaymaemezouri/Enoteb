import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface SectionLabelProps {
  children: ReactNode;
  centered?: boolean;
  className?: string;
  id?: string;
}

export function SectionLabel({ children, centered = false, className, id }: SectionLabelProps) {
  return (
    <div className={cn('section-label-row', centered && 'section-label-row--center', className)}>
      <span
        className={cn('section-label-line', centered && 'section-label-line--sm')}
        aria-hidden
      />
      <p className="section-label" id={id}>
        {children}
      </p>
      {centered ? <span className="section-label-line section-label-line--sm" aria-hidden /> : null}
    </div>
  );
}
