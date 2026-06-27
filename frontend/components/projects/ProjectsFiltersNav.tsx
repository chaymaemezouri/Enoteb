'use client';

import Link from 'next/link';
import { projectsPageContent } from '@/config/projects';
import { cn } from '@/lib/cn';
import { buildProjectsUrl } from '@/lib/projects-url';
import type { Sector } from '@/types';

interface ProjectsFiltersNavProps {
  sectors: Sector[];
  activeSector?: Sector;
  searchQuery?: string;
  className?: string;
  linkClassName?: string;
  variant?: 'sidebar' | 'chips';
  onNavigate?: () => void;
}

export function ProjectsFiltersNav({
  sectors,
  activeSector,
  searchQuery,
  className,
  linkClassName,
  variant = 'sidebar',
  onNavigate,
}: ProjectsFiltersNavProps) {
  const { listing } = projectsPageContent;
  const q = searchQuery?.trim() || undefined;
  const isChips = variant === 'chips';

  return (
    <nav
      className={cn(
        'projects-filters__nav',
        isChips && 'projects-filters__nav--chips',
        className,
      )}
      aria-label={listing.filterLabel}
    >
      <Link
        href={buildProjectsUrl({ q })}
        onClick={onNavigate}
        className={cn(
          'projects-filters__link',
          isChips && 'projects-filters__link--chip',
          linkClassName,
          !activeSector && 'projects-filters__link--active',
        )}
        aria-current={!activeSector ? 'page' : undefined}
      >
        {listing.allSectorsLabel}
      </Link>

      {sectors.map((sector) => (
        <Link
          key={sector.id}
          href={buildProjectsUrl({ sector: sector.slug, q })}
          onClick={onNavigate}
          className={cn(
            'projects-filters__link',
            isChips && 'projects-filters__link--chip',
            linkClassName,
            activeSector?.slug === sector.slug && 'projects-filters__link--active',
          )}
          aria-current={activeSector?.slug === sector.slug ? 'page' : undefined}
        >
          {sector.name}
        </Link>
      ))}
    </nav>
  );
}
