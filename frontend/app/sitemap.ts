import type { MetadataRoute } from 'next';
import { api } from '@/lib/api';
import { buildProjectsUrl } from '@/lib/projects-url';
import { absoluteUrl } from '@/lib/seo';

export const revalidate = 3600;

const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
}> = [
  { path: '/', changeFrequency: 'weekly', priority: 1 },
  { path: '/qui-sommes-nous', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/secteurs', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/projets', changeFrequency: 'daily', priority: 0.9 },
  { path: '/contact', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/mentions-legales', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/confidentialite', changeFrequency: 'yearly', priority: 0.3 },
];

async function getAllProjectSlugs(): Promise<Array<{ slug: string }>> {
  const slugs: Array<{ slug: string }> = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const response = await api.getProjects({ page, limit: 50 }, { revalidate: 3600 });

    slugs.push(...response.data.map((project) => ({ slug: project.slug })));
    totalPages = response.meta.totalPages;
    page += 1;
  }

  return slugs;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  try {
    const sectors = await api.getSectors({ revalidate: 3600 });

    for (const sector of sectors) {
      entries.push({
        url: absoluteUrl(buildProjectsUrl({ sector: sector.slug })),
        lastModified: new Date(sector.updatedAt),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  } catch {
    // API indisponible : le sitemap conserve les pages statiques.
  }

  try {
    const projects = await getAllProjectSlugs();

    for (const project of projects) {
      entries.push({
        url: absoluteUrl(`/projets/${project.slug}`),
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  } catch {
    // API indisponible : pas d’URLs projets dynamiques.
  }

  return entries;
}
