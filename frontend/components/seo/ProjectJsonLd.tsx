import { resolveImageUrl } from '@/lib/utils';
import { buildProjectsUrl } from '@/lib/projects-url';
import { absoluteUrl } from '@/lib/seo';
import type { Project } from '@/types';
import { JsonLd } from './JsonLd';

interface ProjectJsonLdProps {
  project: Project;
}

export function ProjectJsonLd({ project }: ProjectJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.name,
    description: project.description,
    url: absoluteUrl(`/projets/${project.slug}`),
    image: resolveImageUrl(project.mainImageUrl),
    contentLocation: {
      '@type': 'Place',
      name: project.location,
      address: {
        '@type': 'PostalAddress',
        addressLocality: project.location,
        addressCountry: 'MA',
      },
    },
    ...(project.year ? { dateCreated: `${project.year}-01-01` } : {}),
    ...(project.sector
      ? {
          about: {
            '@type': 'Thing',
            name: project.sector.name,
            url: absoluteUrl(buildProjectsUrl({ sector: project.sector.slug })),
          },
        }
      : {}),
    creator: {
      '@type': 'Organization',
      name: 'ENOTEB',
      url: absoluteUrl('/'),
    },
  };

  return <JsonLd id={`project-jsonld-${project.slug}`} data={data} />;
}
