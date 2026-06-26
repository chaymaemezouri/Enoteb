import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProjectCard } from '@/components/home/ProjectCard';
import { FadeIn } from '@/components/home/FadeIn';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SectorDetailHero } from '@/components/sectors/SectorDetailHero';
import { BreadcrumbJsonLd } from '@/components/seo';
import { EmptyState } from '@/components/shared/EmptyState';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { api, ApiClientError } from '@/lib/api';
import { FOOTER_SECTION_BG } from '@/lib/footer-theme';
import { createPageMetadata } from '@/lib/seo';
import { truncateText } from '@/lib/utils';

export const revalidate = 300;
export const dynamicParams = true;

interface SectorPageProps {
  params: { slug: string };
}

async function getSector(slug: string) {
  return api.getSectorBySlug(slug, { page: 1, limit: 12 }, { revalidate: 300 });
}

export async function generateStaticParams() {
  try {
    const sectors = await api.getSectors({ revalidate: false });
    return sectors.map((sector) => ({ slug: sector.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: SectorPageProps): Promise<Metadata> {
  try {
    const sector = await getSector(params.slug);

    return createPageMetadata({
      title: sector.name,
      description: truncateText(sector.description, 160),
      path: `/secteurs/${params.slug}`,
      image: sector.imageUrl,
    });
  } catch {
    return createPageMetadata({
      title: 'Secteur',
      description: 'Découvrez nos secteurs d’activité et nos réalisations.',
      path: `/secteurs/${params.slug}`,
    });
  }
}

export default async function SectorDetailPage({ params }: SectorPageProps) {
  let sector;

  try {
    sector = await getSector(params.slug);
  } catch (error) {
    if (error instanceof ApiClientError && error.statusCode === 404) {
      notFound();
    }

    notFound();
  }

  const { projects, ...sectorData } = sector;
  const projectList = projects.data;

  return (
    <div className="sectors-page">
      <BreadcrumbJsonLd
        items={[
          { name: 'Accueil', path: '/' },
          { name: 'Secteurs', path: '/secteurs' },
          { name: sectorData.name, path: `/secteurs/${sectorData.slug}` },
        ]}
      />

      <SectorDetailHero sector={sectorData} />

      <section
        className="bg-[#F3F0E8] py-16 sm:py-20 lg:py-24"
        data-header-theme="light"
        aria-labelledby="sector-projects-title"
      >
        <div className="home-shell w-full">
          <FadeIn>
            <div className="max-w-2xl">
              <SectionLabel>Réalisations</SectionLabel>
              <h2
                id="sector-projects-title"
                className="enoteb-title enoteb-title--section enoteb-title--on-light mt-4 sm:mt-5"
              >
                Projets en {sectorData.name.toLowerCase()}
              </h2>
              {projectList.length > 0 ? (
                <p className="enoteb-lead enoteb-lead--on-light mt-3 sm:mt-4">
                  {projects.meta.total} projet{projects.meta.total > 1 ? 's' : ''} publié
                  {projects.meta.total > 1 ? 's' : ''} dans ce secteur.
                </p>
              ) : null}
            </div>
          </FadeIn>

          {projectList.length > 0 ? (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {projectList.map((project, index) => (
                <FadeIn key={project.id} delay={index * 0.06}>
                  <ProjectCard project={project} />
                </FadeIn>
              ))}
            </div>
          ) : (
            <FadeIn className="mt-10">
              <EmptyState
                title="Aucun projet publié pour le moment"
                description="Nos équipes préparent actuellement de nouvelles réalisations dans ce secteur. Revenez bientôt ou contactez-nous pour discuter de votre projet."
              />
            </FadeIn>
          )}
        </div>
      </section>

      <div style={{ backgroundColor: FOOTER_SECTION_BG }} data-header-theme="dark">
        <SiteFooter />
      </div>
    </div>
  );
}
