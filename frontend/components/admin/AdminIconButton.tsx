import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'ghost' | 'secondary' | 'danger' | 'primary';
type Size = 'sm' | 'md';

interface AdminIconButtonBaseProps {
  label: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

type AdminIconButtonAsButton = AdminIconButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type AdminIconButtonAsLink = AdminIconButtonBaseProps & {
  href: string;
  target?: string;
  rel?: string;
  onClick?: never;
  disabled?: never;
};

export type AdminIconButtonProps = AdminIconButtonAsButton | AdminIconButtonAsLink;

const variantClass: Record<Variant, string> = {
  ghost: 'admin-icon-btn--ghost',
  secondary: 'admin-icon-btn--secondary',
  danger: 'admin-icon-btn--danger',
  primary: 'admin-icon-btn--primary',
};

export function AdminIconButton({
  label,
  variant = 'ghost',
  size = 'sm',
  className,
  children,
  ...props
}: AdminIconButtonProps) {
  const classes = cn(
    'admin-icon-btn',
    variantClass[variant],
    size === 'md' && 'admin-icon-btn--md',
    className,
  );

  if ('href' in props && props.href) {
    const { href, target, rel } = props;
    return (
      <Link
        href={href}
        className={classes}
        aria-label={label}
        title={label}
        target={target}
        rel={rel}
      >
        {children}
      </Link>
    );
  }

  const { disabled, onClick, type = 'button', ...rest } = props as AdminIconButtonAsButton;

  return (
    <button
      type={type}
      className={classes}
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}
