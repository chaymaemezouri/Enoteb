import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function AboutSectionLabel({
  children,
  centered = false,
  dark = false,
  className,
}: {
  children: ReactNode;
  centered?: boolean;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-2.5', centered && 'justify-center', className)}>
      <span className="h-px w-7 shrink-0 bg-[#FF6A1A]/80" aria-hidden />
      <p
        className={cn(
          'text-[0.625rem] font-semibold uppercase tracking-[0.32em]',
          dark ? 'text-[#FF6A1A]' : 'text-[#FF6A1A]',
        )}
      >
        {children}
      </p>
      {centered ? <span className="h-px w-7 shrink-0 bg-[#FF6A1A]/80" aria-hidden /> : null}
    </div>
  );
}
