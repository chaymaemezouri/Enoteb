import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function AboutSectionLabel({
  children,
  centered = false,
  className,
}: {
  children: ReactNode;
  centered?: boolean;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={cn(centered && 'flex justify-center', className)}>
      <p className="section-label">{children}</p>
    </div>
  );
}
