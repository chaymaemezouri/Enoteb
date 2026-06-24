import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/cn';

interface PageHeroProps {
  overline?: string;
  title: string;
  description?: string;
  className?: string;
  dark?: boolean;
}

export function PageHero({ overline, title, description, className, dark = true }: PageHeroProps) {
  return (
    <section
      className={cn(
        'py-section-sm lg:py-section',
        dark ? 'bg-neutral-900 text-white' : 'bg-surface-muted',
        className,
      )}
    >
      <Container>
        <div className="max-w-3xl">
          {overline ? (
            <p className={cn('text-overline mb-4', dark ? 'text-accent-300' : 'text-accent')}>
              {overline}
            </p>
          ) : null}
          <h1
            className={cn(
              'text-h1 text-balance sm:text-display',
              dark ? 'text-white' : 'text-neutral-900',
            )}
          >
            {title}
          </h1>
          {description ? (
            <p
              className={cn(
                'mt-6 text-subtitle-lg',
                dark ? 'text-neutral-300' : 'text-neutral-600',
              )}
            >
              {description}
            </p>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
