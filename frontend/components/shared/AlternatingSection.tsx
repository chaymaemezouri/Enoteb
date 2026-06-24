import Image from 'next/image';
import { ReactNode } from 'react';
import { FadeIn } from '@/components/home/FadeIn';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { cn } from '@/lib/cn';

interface AlternatingSectionProps {
  overline?: string;
  title: string;
  children: ReactNode;
  imageSrc: string;
  imageAlt: string;
  reversed?: boolean;
  className?: string;
  bgMuted?: boolean;
}

export function AlternatingSection({
  overline,
  title,
  children,
  imageSrc,
  imageAlt,
  reversed = false,
  className,
  bgMuted = false,
}: AlternatingSectionProps) {
  return (
    <section
      className={cn(
        'py-section-sm lg:py-section',
        bgMuted ? 'bg-surface-muted' : 'bg-background',
        className,
      )}
    >
      <Container>
        <div
          className={cn(
            'grid items-center gap-10 lg:grid-cols-2 lg:gap-16',
            reversed && '[&>*:first-child]:lg:order-2 [&>*:last-child]:lg:order-1',
          )}
        >
          <FadeIn>
            <SectionTitle overline={overline} title={title} className="max-w-none" />
            <div className="mt-6 space-y-4 text-body text-neutral-600">{children}</div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-card shadow-card">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}
