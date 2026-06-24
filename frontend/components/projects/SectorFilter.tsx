import Link from 'next/link';
import { cn } from '@/lib/cn';
import type { Sector } from '@/types';

interface SectorFilterProps {
  sectors: Sector[];
  activeSector?: string;
}

function buildProjectsUrl(sector?: string): string {
  if (!sector) {
    return '/projets';
  }

  return `/projets?sector=${encodeURIComponent(sector)}`;
}

export function SectorFilter({ sectors, activeSector }: SectorFilterProps) {
  return (
    <nav className="flex flex-wrap gap-2" aria-label="Filtrer par secteur">
      <Link
        href={buildProjectsUrl()}
        className={cn(
          'link-focus rounded-full px-4 py-2 text-body-sm font-medium transition-colors',
          !activeSector
            ? 'bg-accent text-accent-foreground'
            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200',
        )}
        aria-current={!activeSector ? 'page' : undefined}
      >
        Tous
      </Link>

      {sectors.map((sector) => {
        const isActive = activeSector === sector.slug;

        return (
          <Link
            key={sector.id}
            href={buildProjectsUrl(sector.slug)}
            className={cn(
              'link-focus rounded-full px-4 py-2 text-body-sm font-medium transition-colors',
              isActive
                ? 'bg-accent text-accent-foreground'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200',
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            {sector.name}
          </Link>
        );
      })}
    </nav>
  );
}
