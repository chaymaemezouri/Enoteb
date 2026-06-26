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
  onNavigate?: () => void;
}

export function ProjectsFiltersNav({
  sectors,
  activeSector,
  searchQuery,
  className,
  linkClassName,
  onNavigate,
}: ProjectsFiltersNavProps) {
  const { listing } = projectsPageContent;
  const q = searchQuery?.trim() || undefined;

  return (
    <nav className={cn('projects-filters__nav', className)}>
      <Link
        href={buildProjectsUrl({ q })}
        onClick={onNavigate}
        className={cn(
          'projects-filters__link',
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
