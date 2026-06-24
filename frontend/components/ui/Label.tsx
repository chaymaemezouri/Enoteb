import { LabelHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export function Label({ children, className, required, ...props }: LabelProps) {
  return (
    <label
      className={cn('mb-2 block text-body-sm font-medium text-neutral-800', className)}
      {...props}
    >
      {children}
      {required ? (
        <span className="text-red-600" aria-hidden>
          {' '}
          *
        </span>
      ) : null}
    </label>
  );
}
