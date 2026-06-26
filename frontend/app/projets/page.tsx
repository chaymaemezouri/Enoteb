import type { Metadata } from 'next';
import { ProjectsApproach, ProjectsHero, ProjectsListing } from '@/components/projects';
import { CtaFooterSection } from '@/components/home';
import { BreadcrumbJsonLd } from '@/components/seo';
import { projectsPageContent } from '@/config/projects';
import { api } from '@/lib/api';
import { createPageMetadata } from '@/lib/seo';
import type { PaginatedResponse, ProjectSummary, Sector } from '@/types';

export const revalidate = 3600;

const PROJECTS_PER_PAGE = 8;

interface ProjectsPageProps {
  searchParams: { sector?: string; page?: string };
}

async function getProjectsPageData(
  sector?: string,
  page = 1,
): Promise<{
  sectors: Sector[];
  projects: PaginatedResponse<ProjectSummary>;
}> {
  const [sectors, projects] = await Promise.all([
    api.getSectors({ revalidate: 3600 }).catch(() => [] as Sector[]),
    api.getProjects({ sector, page, limit: PROJECTS_PER_PAGE }, { revalidate: 3600 }).catch(() => ({
      data: [],
      meta: { total: 0, page: 1, limit: PROJECTS_PER_PAGE, totalPages: 0 },
    })),
  ]);

  return { sectors, projects };
}

export async function generateMetadata({ searchParams }: ProjectsPageProps): Promise<Metadata> {
  const sectorSlug = searchParams.sector;

  if (!sectorSlug) {
    return createPageMetadata({
      title: projectsPageContent.meta.title,
      description: projectsPageContent.meta.description,
      path: '/projets',
    });
  }

  try {
    const sectors = await api.getSectors({ revalidate: 3600 });
    const sector = sectors.find((item) => item.slug === sectorSlug);

    if (sector) {
      const sectorCopy = projectsPageContent.sectorHero[sector.slug];
      return createPageMetadata({
        title: `Projets — ${sector.name}`,
        description:
          sector.description?.trim() ||
          sectorCopy?.description ||
          `Réalisations ENOTEB dans le secteur ${sector.name}.`,
        path: `/projets?sector=${sector.slug}`,
        image: sector.imageUrl,
      });
    }
  } catch {
    // fallback ci-dessous
  }

  return createPageMetadata({
    title: projectsPageContent.meta.title,
    description: projectsPageContent.meta.description,
    path: '/projets',
  });
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const sectorSlug = searchParams.sector;
  const page = Math.max(1, Number.parseInt(searchParams.page ?? '1', 10) || 1);

  const { sectors, projects } = await getProjectsPageData(sectorSlug, page);
  const activeSector = sectors.find((item) => item.slug === sectorSlug);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Accueil', path: '/' },
          { name: 'Projets', path: '/projets' },
          ...(activeSector
            ? [{ name: activeSector.name, path: `/projets?sector=${activeSector.slug}` }]
            : []),
        ]}
      />
      <ProjectsHero sector={activeSector} />
      <ProjectsListing sectors={sectors} projects={projects} activeSector={activeSector} />
      <ProjectsApproach />
      <CtaFooterSection />
    </>
  );
}
