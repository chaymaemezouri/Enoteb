import { cva, type VariantProps } from 'class-variance-authority';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-button font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-accent text-accent-foreground hover:bg-accent-700 active:bg-accent-800',
        secondary: 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200 active:bg-neutral-300',
        outline:
          'border border-border-strong bg-transparent text-neutral-800 hover:bg-neutral-50 active:bg-neutral-100',
        ghost: 'bg-transparent text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200',
        danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
      },
      size: {
        sm: 'h-9 px-3 text-body-sm',
        md: 'h-11 px-5 text-body',
        lg: 'h-12 px-6 text-subtitle',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
    );
  },
);

Button.displayName = 'Button';

export { buttonVariants };
