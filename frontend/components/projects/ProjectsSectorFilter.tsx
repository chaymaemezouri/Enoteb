'use client';

import { projectsPageContent } from '@/config/projects';
import { cn } from '@/lib/cn';
import type { Sector } from '@/types';
import { ProjectsFiltersNav } from './ProjectsFiltersNav';

interface ProjectsFiltersSidebarProps {
  sectors: Sector[];
  activeSector?: Sector;
  searchQuery?: string;
  total: number;
  className?: string;
}

export function ProjectsFiltersSidebar({
  sectors,
  activeSector,
  searchQuery,
  total,
  className,
}: ProjectsFiltersSidebarProps) {
  const { listing } = projectsPageContent;
  const countLabel = total === 1 ? listing.resultsLabel : listing.resultsLabelPlural;

  return (
    <aside className={cn('projects-filters', className)} aria-label={listing.filterLabel}>
      <p className="projects-filters__title">
        <span>{listing.filterLabel}</span>
      </p>

      <ProjectsFiltersNav sectors={sectors} activeSector={activeSector} searchQuery={searchQuery} />

      {total > 0 ? (
        <p className="projects-filters__count">
          <span className="tabular-nums">{total}</span> {countLabel}
        </p>
      ) : null}
    </aside>
  );
}

/** @deprecated Utiliser ProjectsFiltersSidebar */
export function ProjectsRefineFilter(
  props: ProjectsFiltersSidebarProps & { activeSector?: string },
) {
  const sector = props.activeSector
    ? props.sectors.find((s) => s.slug === props.activeSector)
    : undefined;

  return (
    <ProjectsFiltersSidebar
      sectors={props.sectors}
      activeSector={sector}
      searchQuery={props.searchQuery}
      total={props.total}
      className={props.className}
    />
  );
}

export function ProjectsSectorFilter(props: ProjectsFiltersSidebarProps) {
  return <ProjectsFiltersSidebar {...props} />;
}
