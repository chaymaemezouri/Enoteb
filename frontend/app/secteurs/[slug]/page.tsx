import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ProjectCard } from '@/components/home/ProjectCard';
import { FadeIn } from '@/components/home/FadeIn';
import { BreadcrumbJsonLd } from '@/components/seo';
import { EmptyState } from '@/components/shared/EmptyState';
import { api, ApiClientError } from '@/lib/api';
import { createPageMetadata } from '@/lib/seo';
import { resolveImageUrl, truncateText } from '@/lib/utils';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';

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
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Accueil', path: '/' },
          { name: 'Secteurs', path: '/secteurs' },
          { name: sectorData.name, path: `/secteurs/${sectorData.slug}` },
        ]}
      />
      <section className="relative overflow-hidden bg-neutral-900 text-white">
        <div className="absolute inset-0" aria-hidden>
          <Image
            src={resolveImageUrl(sectorData.imageUrl)}
            alt={`Chantier représentatif du secteur ${sectorData.name}`}
            fill
            className="object-cover opacity-40"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-neutral-950/70" />
        </div>

        <Container className="relative py-section-sm lg:py-section">
          <FadeIn className="max-w-3xl">
            <p className="text-overline text-accent-300">Secteur</p>
            <h1 className="mt-3 text-h1 text-balance text-white sm:text-display">
              {sectorData.name}
            </h1>
            <p className="mt-6 text-subtitle-lg text-neutral-200">{sectorData.description}</p>
          </FadeIn>
        </Container>
      </section>

      <section className="py-section-sm lg:py-section">
        <Container>
          <FadeIn>
            <SectionTitle
              overline="Réalisations"
              title={`Projets en ${sectorData.name.toLowerCase()}`}
              description={
                projectList.length > 0
                  ? `${projects.meta.total} projet${projects.meta.total > 1 ? 's' : ''} publié${projects.meta.total > 1 ? 's' : ''} dans ce secteur.`
                  : undefined
              }
            />
          </FadeIn>

          {projectList.length > 0 ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
        </Container>
      </section>
    </>
  );
}
