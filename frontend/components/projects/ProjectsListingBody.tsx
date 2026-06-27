'use client';

import { projectsPageContent } from '@/config/projects';
import type { PaginatedResponse, ProjectSummary, Sector } from '@/types';
import { ProjectsGridCard } from './ProjectsGridCard';
import { ProjectsPaginationBar } from './ProjectsPaginationBar';

interface ProjectsListingBodyProps {
  projects: PaginatedResponse<ProjectSummary>;
  activeSector?: Sector;
  searchQuery?: string;
}

export function ProjectsListingBody({
  projects,
  activeSector,
  searchQuery,
}: ProjectsListingBodyProps) {
  const { listing } = projectsPageContent;
  const hasSearch = Boolean(searchQuery?.trim());
  const { data, meta } = projects;
  const pageOffset = (meta.page - 1) * meta.limit;

  if (data.length === 0) {
    return (
      <div className="projects-empty">
        <h2 className="enoteb-title enoteb-title--section enoteb-title--on-light text-[1.25rem]">
          {listing.emptyTitle}
        </h2>
        <p className="enoteb-lead enoteb-lead--on-light mx-auto mt-4 max-w-md">
          {hasSearch
            ? listing.emptySearch
            : activeSector
              ? listing.emptySector
              : listing.emptyAll}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="projects-grid">
        {data.map((project, index) => (
          <ProjectsGridCard
            key={project.id}
            project={project}
            index={pageOffset + index}
            delay={0.04 + index * 0.05}
          />
        ))}
      </div>

      <ProjectsPaginationBar meta={meta} sector={activeSector?.slug} q={searchQuery} />
    </>
  );
}
