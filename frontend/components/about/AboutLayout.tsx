import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export const ABOUT_SHELL = 'home-shell mx-auto w-full max-w-[72rem] 2xl:max-w-[76rem]';

type Tone = 'dark' | 'sand' | 'sandSoft' | 'deep';

const toneMap: Record<Tone, { bg: string; header: 'dark' | 'light' }> = {
  dark: { bg: 'bg-[#071018]', header: 'dark' },
  deep: { bg: 'bg-[#0B1420]', header: 'dark' },
  sand: { bg: 'bg-[#F3F0E8]', header: 'light' },
  sandSoft: { bg: 'bg-[#F6F2EA]', header: 'light' },
};

export function AboutSection({
  tone = 'sand',
  children,
  className,
  id,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
  id?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}) {
  const { bg, header } = toneMap[tone];

  return (
    <section
      id={id}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      data-header-theme={header}
      className={cn(
        'about-v2-section relative overflow-x-clip',
        bg,
        tone === 'dark' && 'about-v2-section--dark',
        tone === 'deep' && 'about-v2-section--deep',
        tone === 'sand' && 'about-v2-section--sand',
        tone === 'sandSoft' && 'about-v2-section--sand-soft',
        className,
      )}
    >
      {tone === 'sand' || tone === 'sandSoft' ? (
        <div
          className={cn(
            'about-v2-sand-grid pointer-events-none absolute inset-0',
            tone === 'sandSoft' && 'about-v2-sand-grid--soft',
          )}
          aria-hidden
        />
      ) : null}
      {tone === 'dark' || tone === 'deep' ? (
        <div className="about-v2-dark-glow pointer-events-none absolute inset-0" aria-hidden />
      ) : null}
      {children}
    </section>
  );
}

export function AboutContainer({
  children,
  className,
  narrow,
  compact,
}: {
  children: ReactNode;
  className?: string;
  narrow?: boolean;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        ABOUT_SHELL,
        'about-v2-container relative px-5 sm:px-6 lg:px-8',
        compact && 'about-v2-container--compact',
        narrow && 'max-w-3xl',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function AboutLabel({
  children,
  light,
  className,
  center,
}: {
  children: ReactNode;
  light?: boolean;
  className?: string;
  center?: boolean;
}) {
  return (
    <div className={cn(center && 'flex justify-center', className)}>
      <span className="section-label">{children}</span>
    </div>
  );
}

export function AboutTitle({
  children,
  light,
  className,
  as: Tag = 'h2',
  id,
}: {
  children: ReactNode;
  light?: boolean;
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
  id?: string;
}) {
  return (
    <Tag
      id={id}
      className={cn(
        'enoteb-title enoteb-title--section',
        light ? 'enoteb-title--on-dark' : 'enoteb-title--on-light',
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function AboutLead({
  children,
  light,
  className,
}: {
  children: ReactNode;
  light?: boolean;
  className?: string;
}) {
  return (
    <p
      className={cn(
        'enoteb-lead',
        light ? 'enoteb-lead--on-dark' : 'enoteb-lead--on-light',
        className,
      )}
    >
      {children}
    </p>
  );
}

export function AboutAccentMark({ className }: { className?: string }) {
  return <span className={cn('about-v2-accent-mark', className)} aria-hidden />;
}

export function AboutIndexRow({
  title,
  children,
  light,
  className,
}: {
  title: string;
  children: ReactNode;
  light?: boolean;
  className?: string;
}) {
  return (
    <article className={cn('about-v2-row group', className)}>
      <div className="min-w-0 flex-1">
        <h3
          className={cn(
            'text-[1.0625rem] font-semibold tracking-[-0.02em]',
            light ? 'text-[#F8F5EE]' : 'text-[#18212B]',
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            'mt-2 text-[0.875rem] leading-[1.7]',
            light ? 'text-[rgba(248,245,238,0.62)]' : 'text-[#68717D]',
          )}
        >
          {children}
        </p>
      </div>
    </article>
  );
}
