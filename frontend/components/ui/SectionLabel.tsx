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
    <div className={cn(centered && 'flex justify-center', className)}>
      <p className="section-label" id={id}>
        {children}
      </p>
    </div>
  );
}
