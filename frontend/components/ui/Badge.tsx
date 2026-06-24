import { cva, type VariantProps } from 'class-variance-authority';
import { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-caption font-semibold',
  {
    variants: {
      variant: {
        default: 'bg-accent-100 text-accent-800',
        neutral: 'bg-neutral-100 text-neutral-700',
        outline: 'border border-border-strong bg-transparent text-neutral-700',
        success: 'bg-emerald-100 text-emerald-800',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { badgeVariants };
