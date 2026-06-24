import { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  as?: 'div' | 'section' | 'main' | 'article';
  narrow?: boolean;
  fluid?: boolean;
}

export function Container({
  as: Component = 'div',
  narrow = false,
  fluid = false,
  className,
  ...props
}: ContainerProps) {
  return (
    <Component
      className={cn(
        'mx-auto w-full px-4 sm:px-6 lg:px-8',
        !fluid && (narrow ? 'max-w-3xl' : 'max-w-container'),
        className,
      )}
      {...props}
    />
  );
}
