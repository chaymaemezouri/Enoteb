'use client';

import Image from 'next/image';
import { useState } from 'react';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/cn';

interface LogoProps {
  /** @deprecated Même fichier PNG sur fond clair ou sombre */
  variant?: 'default' | 'light';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-9 w-auto max-w-[100px]',
  md: 'h-11 w-auto max-w-[124px] sm:h-12',
  lg: 'h-14 w-auto max-w-[156px] sm:h-16',
};

function WordmarkFallback() {
  return (
    <span className="inline-flex items-baseline gap-0.5">
      <span className="text-xl font-bold tracking-tight text-[var(--brand-charcoal,#2f3136)] sm:text-2xl">
        ENOT
      </span>
      <span className="text-xl font-bold tracking-tight text-accent sm:text-2xl">EB</span>
    </span>
  );
}

export function Logo({ className, size = 'md' }: LogoProps) {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <span className={className}>
        <WordmarkFallback />
      </span>
    );
  }

  return (
    <span className={cn('inline-flex items-center', className)}>
      <Image
        src={siteConfig.logo.src}
        alt={`${siteConfig.name} — logo`}
        width={160}
        height={64}
        className={cn('object-contain object-left', sizeClasses[size])}
        priority
        onError={() => setImageError(true)}
      />
    </span>
  );
}
