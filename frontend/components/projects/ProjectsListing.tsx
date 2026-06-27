import type { PaginatedResponse, ProjectSummary, Sector } from '@/types';
import { ProjectsHero } from './ProjectsHero';
import { ProjectsListingBody } from './ProjectsListingBody';
import { ProjectsFiltersSidebar } from './ProjectsSectorFilter';
import { ProjectsCatalogToolbar } from './ProjectsCatalogToolbar';
import { PROJECTS_SHELL } from './projectsMotion';

interface ProjectsListingProps {
  sectors: Sector[];
  projects: PaginatedResponse<ProjectSummary>;
  activeSector?: Sector;
  searchQuery?: string;
}

export function ProjectsListing({
  sectors,
  projects,
  activeSector,
  searchQuery,
}: ProjectsListingProps) {
  return (
    <section className="projects-catalog" data-header-theme="light">
      <div className="projects-catalog__sand" aria-hidden />
      <div className="projects-catalog__grid" aria-hidden />

      <div className={`relative ${PROJECTS_SHELL} projects-catalog__inner`}>
        <ProjectsHero sector={activeSector} />

        <div className="projects-listing__layout">
          <ProjectsFiltersSidebar
            sectors={sectors}
            activeSector={activeSector}
            searchQuery={searchQuery}
            className="projects-listing__sidebar hidden lg:block"
          />

          <div className="projects-listing__main">
            <ProjectsCatalogToolbar
              sectors={sectors}
              activeSector={activeSector}
              searchQuery={searchQuery}
            />

            <ProjectsListingBody
              projects={projects}
              activeSector={activeSector}
              searchQuery={searchQuery}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
