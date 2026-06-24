import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { ProjectDetailView } from '@/components/projects/ProjectDetailView';
import { BreadcrumbJsonLd, ProjectJsonLd } from '@/components/seo';
import { projectsPageContent } from '@/config/projects';
import { PROJECTS_CONTAINER } from '@/components/projects/projectsMotion';
import { api, ApiClientError } from '@/lib/api';
import { splitProjectTitle } from '@/lib/projectDetail';
import { createPageMetadata } from '@/lib/seo';
import { truncateText } from '@/lib/utils';
import { Container } from '@/components/ui/Container';
import type { Project } from '@/types';

export const revalidate = 3600;
export const dynamicParams = true;

interface ProjectPageProps {
  params: { slug: string };
}

async function getProject(slug: string): Promise<Project> {
  return api.getProjectBySlug(slug, { revalidate: 3600 });
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
                  path: `/secteurs/${project.sector.slug}`,
                },
              ]
            : []),
          { name: project.name, path: `/projets/${project.slug}` },
        ]}
      />

      <section className="bg-[#F5F2EC] py-8 sm:py-10 lg:py-12" data-header-theme="light">
        <Container fluid className={PROJECTS_CONTAINER}>
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <Link
              href="/projets"
              className="link-focus inline-flex items-center gap-2 text-[0.8125rem] font-medium text-[#6B7078] transition-colors hover:text-[#FF6B1A] focus-visible:ring-[#FF6B1A]"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              {detail.backLabel}
            </Link>
            {project.sector ? (
              <Link
                href={`/secteurs/${project.sector.slug}`}
                className="link-focus text-[0.8125rem] font-medium text-[#6B7078] transition-colors hover:text-[#FF6B1A] focus-visible:ring-[#FF6B1A]"
              >
                {project.sector.name}
              </Link>
            ) : null}
          </div>

          <ProjectDetailView project={project} titlePrimary={primary} titleAccent={accent} />
        </Container>
      </section>
    </>
  );
}
