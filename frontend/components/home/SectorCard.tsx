import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { homeContent } from '@/config/home';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { cn } from '@/lib/cn';
import { resolveThumbnailUrl, truncateText } from '@/lib/utils';
import type { Sector } from '@/types';
import { FadeIn } from './FadeIn';

interface SectorCardProps {
  sector: Sector;
  featured?: boolean;
}

export function SectorCard({ sector, featured = false }: SectorCardProps) {
  const imageUrl = resolveThumbnailUrl(sector.imageUrl, sector.slug);

  return (
    <Link href={`/secteurs/${sector.slug}`} className="card-link group block h-full">
      <article
        className={cn(
          'relative h-full min-h-[280px] overflow-hidden rounded-2xl ring-1 ring-neutral-200/60 transition duration-300 hover:shadow-2xl hover:ring-accent/30',
          featured && 'min-h-[360px] lg:min-h-[400px]',
        )}
      >
        <Image
          src={imageUrl}
          alt={`Secteur ${sector.name}`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes={featured ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 100vw, 33vw'}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/40 to-neutral-950/10" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
          <span className="text-caption font-semibold uppercase tracking-widest text-accent-400">
            Secteur
          </span>
          <h3 className="mt-2 text-2xl font-bold text-white">{sector.name}</h3>
          <p className="mt-2 max-w-md text-body-sm text-neutral-300">
            {truncateText(sector.description, featured ? 160 : 100)}
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-body-sm font-medium text-white/90 transition group-hover:text-accent-300">
            Explorer
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </span>
        </div>
      </article>
    </Link>
  );
}
