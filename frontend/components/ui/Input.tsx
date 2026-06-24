import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, id, ...props }, ref) => {
    return (
      <div>
        <input
          ref={ref}
          id={id}
          className={cn(
            'flex h-11 w-full rounded-button border border-border bg-background px-3 text-body text-neutral-900 transition-colors placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500 focus-visible:ring-red-500',
            className,
          )}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
        {error ? (
          <p id={`${id}-error`} className="mt-1.5 text-body-sm text-red-600">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = 'Input';
