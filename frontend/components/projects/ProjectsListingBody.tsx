'use client';

import { projectsPageContent } from '@/config/projects';
import type { PaginatedResponse, ProjectSummary, Sector } from '@/types';
import { ProjectsGridCard } from './ProjectsGridCard';
import { ProjectsPaginationBar } from './ProjectsPaginationBar';
import { ProjectsRefineFilter } from './ProjectsSectorFilter';

interface ProjectsListingBodyProps {
  sectors: Sector[];
  projects: PaginatedResponse<ProjectSummary>;
  activeSector?: Sector;
}

export function ProjectsListingBody({ sectors, projects, activeSector }: ProjectsListingBodyProps) {
  const { listing } = projectsPageContent;

  return (
    <div className="projects-listing__layout mt-8 sm:mt-10">
      <ProjectsRefineFilter
        sectors={sectors}
        activeSector={activeSector?.slug}
        className="projects-listing__sidebar"
      />

      <div className="projects-listing__main min-w-0">
        {projects.data.length > 0 ? (
          <>
            <div className="projects-grid grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.data.map((project, index) => (
                <ProjectsGridCard
                  key={project.id}
                  project={project}
                  index={index}
                  delay={index * 0.04}
                />
              ))}
            </div>

            <ProjectsPaginationBar meta={projects.meta} sector={activeSector?.slug} />
          </>
        ) : (
          <div className="projects-listing__empty border border-[#18212B]/10 bg-white px-6 py-14 text-center sm:px-10">
            <h2 className="text-lg font-bold tracking-[-0.02em] text-[#18212B]">
              {listing.emptyTitle}
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#68717D]">
              {activeSector ? listing.emptySector : listing.emptyAll}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
