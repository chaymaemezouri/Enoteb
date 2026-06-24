import { cva, type VariantProps } from 'class-variance-authority';
import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/cn';

const cardVariants = cva('rounded-card border bg-surface', {
  variants: {
    variant: {
      default: 'border-border shadow-card',
      elevated: 'border-border shadow-card-hover',
      muted: 'border-border bg-surface-muted shadow-none',
      ghost: 'border-transparent bg-transparent shadow-none',
    },
    padding: {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
  },
  defaultVariants: {
    variant: 'default',
    padding: 'md',
  },
});

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(cardVariants({ variant, padding }), className)} {...props} />
    );
  },
);

Card.displayName = 'Card';

export { cardVariants };
