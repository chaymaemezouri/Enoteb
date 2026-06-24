import Link, { type LinkProps } from 'next/link';
import { type AnchorHTMLAttributes, type ReactNode } from 'react';
import { buttonVariants, type ButtonProps } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

interface ButtonLinkProps
  extends
    Omit<LinkProps, 'href'>,
    Pick<ButtonProps, 'variant' | 'size'>,
    Pick<AnchorHTMLAttributes<HTMLAnchorElement>, 'target' | 'rel'> {
  href: LinkProps['href'];
  className?: string;
  children: ReactNode;
}
export function ButtonLink({
  href,
  variant,
  size,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link href={href} className={cn(buttonVariants({ variant, size }), className)} {...props}>
      {children}
    </Link>
  );
}
