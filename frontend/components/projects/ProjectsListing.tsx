import { projectsPageContent } from '@/config/projects';
import { Container } from '@/components/ui/Container';
import type { PaginatedResponse, ProjectSummary, Sector } from '@/types';
import { ProjectsGridCard } from './ProjectsGridCard';
import { ProjectsPaginationBar } from './ProjectsPaginationBar';
import { ProjectsSectorFilter } from './ProjectsSectorFilter';
import { PROJECTS_CONTAINER } from './projectsMotion';

interface ProjectsListingProps {
  sectors: Sector[];
  projects: PaginatedResponse<ProjectSummary>;
  activeSector?: string;
}

export function ProjectsListing({ sectors, projects, activeSector }: ProjectsListingProps) {
  const { listing } = projectsPageContent;
  const showFeatured = projects.meta.page === 1 && !activeSector && projects.data.length > 0;

  return (
    <section className="bg-[#F5F2EC] py-12 sm:py-16 lg:py-20" data-header-theme="light">
      <Container fluid className={PROJECTS_CONTAINER}>
        <ProjectsSectorFilter sectors={sectors} activeSector={activeSector} />

        {projects.data.length > 0 ? (
          <>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
              {projects.data.map((project, index) => (
                <ProjectsGridCard
                  key={project.id}
                  project={project}
                  delay={index * 0.06}
                  featured={showFeatured && index === 0}
                />
              ))}
            </div>

            <ProjectsPaginationBar meta={projects.meta} sector={activeSector} />
          </>
        ) : (
          <div className="mt-10 border border-[#252A30]/10 bg-white px-6 py-14 text-center sm:px-10">
            <h2 className="text-lg font-bold text-[#252A30]">{listing.emptyTitle}</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#6B7078]">
              {activeSector ? listing.emptySector : listing.emptyAll}
            </p>
          </div>
        )}
      </Container>
    </section>
  );
}
