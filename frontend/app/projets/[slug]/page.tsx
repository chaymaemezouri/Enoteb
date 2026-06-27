import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { ProjectDetailView } from '@/components/projects/ProjectDetailView';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { BreadcrumbJsonLd, ProjectJsonLd } from '@/components/seo';
import { projectsPageContent } from '@/config/projects';
import { PROJECTS_SHELL } from '@/components/projects/projectsMotion';
import { buildProjectsUrl } from '@/lib/projects-url';
import { api, ApiClientError } from '@/lib/api';
import { splitProjectTitle } from '@/lib/projectDetail';
import { FOOTER_SECTION_BG } from '@/lib/footer-theme';
import { createPageMetadata } from '@/lib/seo';
import { truncateText } from '@/lib/utils';
import type { Project } from '@/types';

export const dynamic = 'force-dynamic';

interface ProjectPageProps {
  params: { slug: string };
}

async function getProject(slug: string): Promise<Project> {
  return api.getProjectBySlug(slug, { revalidate: 0 });
}

export async function generateStaticParams() {
  try {
    const slugs: { slug: string }[] = [];
    let page = 1;
    let totalPages = 1;

    while (page <= totalPages) {
      const response = await api.getProjects({ page, limit: 50 }, { revalidate: false });

      slugs.push(...response.data.map((project) => ({ slug: project.slug })));
      totalPages = response.meta.totalPages;
      page += 1;
    }

    return slugs;
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  try {
    const project = await getProject(params.slug);

    return createPageMetadata({
      title: project.name,
      description: truncateText(project.description, 160),
      path: `/projets/${params.slug}`,
      image: project.mainImageUrl,
    });
  } catch {
    return createPageMetadata({
      title: 'Projet',
      description: 'Détail d’une réalisation ENOTEB.',
      path: `/projets/${params.slug}`,
    });
  }
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  let project: Project;

  try {
    project = await getProject(params.slug);
  } catch (error) {
    if (error instanceof ApiClientError && error.statusCode === 404) {
      notFound();
    }

    notFound();
  }

  const { primary, accent } = splitProjectTitle(project.name);
  const { detail } = projectsPageContent;

  return (
    <>
      <ProjectJsonLd project={project} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Accueil', path: '/' },
          { name: 'Projets', path: '/projets' },
          ...(project.sector
            ? [
                {
                  name: project.sector.name,
                  path: buildProjectsUrl({ sector: project.sector.slug }),
                },
              ]
            : []),
          { name: project.name, path: `/projets/${project.slug}` },
        ]}
      />

      <div className="projects-page">
        <section className="project-detail-page" data-header-theme="light">
          <div className={`project-detail-page__top ${PROJECTS_SHELL}`}>
            <Link href="/projets" className="project-detail-page__back">
              <ArrowLeft className="h-4 w-4" aria-hidden />
              {detail.backLabel}
            </Link>
          </div>

          <div className={`project-detail-page__stage ${PROJECTS_SHELL}`}>
            <ProjectDetailView project={project} titlePrimary={primary} titleAccent={accent} />
          </div>
        </section>

        <div style={{ backgroundColor: FOOTER_SECTION_BG }} data-header-theme="dark">
          <SiteFooter />
        </div>
      </div>
    </>
  );
}
