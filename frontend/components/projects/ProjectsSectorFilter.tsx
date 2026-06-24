import Link from 'next/link';
import { projectsPageContent } from '@/config/projects';
import { cn } from '@/lib/cn';
import type { Sector } from '@/types';

interface ProjectsSectorFilterProps {
  sectors: Sector[];
  activeSector?: string;
}

function buildProjectsUrl(sector?: string): string {
  if (!sector) return '/projets';
  return `/projets?sector=${encodeURIComponent(sector)}`;
}

const pillBase =
  'link-focus inline-flex items-center border px-4 py-2 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] transition-colors duration-300';

export function ProjectsSectorFilter({ sectors, activeSector }: ProjectsSectorFilterProps) {
  const { listing } = projectsPageContent;

  return (
    <nav
      className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      aria-label={listing.filterLabel}
    >
      <p className="text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-[#6B7078]">
        {listing.filterLabel}
      </p>
      <div className="flex flex-wrap gap-2">
        <Link
          href={buildProjectsUrl()}
          className={cn(
            pillBase,
            !activeSector
              ? 'border-[#FF6B1A] bg-[#FF6B1A] text-white'
              : 'border-[#252A30]/12 bg-white text-[#252A30]/70 hover:border-[#FF6B1A]/35 hover:text-[#252A30]',
          )}
          aria-current={!activeSector ? 'page' : undefined}
        >
          {listing.allLabel}
        </Link>

        {sectors.map((sector) => {
          const isActive = activeSector === sector.slug;

          return (
            <Link
              key={sector.id}
              href={buildProjectsUrl(sector.slug)}
              className={cn(
                pillBase,
                isActive
                  ? 'border-[#FF6B1A] bg-[#FF6B1A] text-white'
                  : 'border-[#252A30]/12 bg-white text-[#252A30]/70 hover:border-[#FF6B1A]/35 hover:text-[#252A30]',
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              {sector.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
