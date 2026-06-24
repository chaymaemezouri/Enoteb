import { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export interface SectionTitleProps extends HTMLAttributes<HTMLDivElement> {
  overline?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
}

export function SectionTitle({
  overline,
  title,
  description,
  align = 'left',
  className,
  ...props
}: SectionTitleProps) {
  return (
    <div
      className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center', className)}
      {...props}
    >
      {overline ? <p className="text-overline text-accent mb-3">{overline}</p> : null}
      <h2 className="text-h2 text-balance text-neutral-900">{title}</h2>
      {description ? <p className="mt-4 text-subtitle text-neutral-600">{description}</p> : null}
    </div>
  );
}
