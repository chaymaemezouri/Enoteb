import type { PaginatedResponse, ProjectSummary, Sector } from '@/types';
import { ProjectsListingBody } from './ProjectsListingBody';
import { ProjectsListingHeader } from './ProjectsListingHeader';
import { PROJECTS_SHELL } from './projectsMotion';

interface ProjectsListingProps {
  sectors: Sector[];
  projects: PaginatedResponse<ProjectSummary>;
  activeSector?: Sector;
}

export function ProjectsListing({ sectors, projects, activeSector }: ProjectsListingProps) {
  return (
    <section
      className="projects-listing relative overflow-x-hidden py-20 sm:py-20 md:py-24 lg:py-28"
      style={{ backgroundColor: '#F6F2EA' }}
      data-header-theme="light"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(24,33,43,0.022)_1px,transparent_1px),linear-gradient(90deg,rgba(24,33,43,0.022)_1px,transparent_1px)] bg-[size:72px_72px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FF6A1A]/10 to-transparent"
        aria-hidden
      />

      <div className={`relative ${PROJECTS_SHELL}`}>
        <ProjectsListingHeader activeSector={activeSector} total={projects.meta.total} />

        <ProjectsListingBody sectors={sectors} projects={projects} activeSector={activeSector} />
      </div>
    </section>
  );
}
