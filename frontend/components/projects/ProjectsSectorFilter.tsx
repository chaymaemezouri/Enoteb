'use client';

import { useRouter } from 'next/navigation';
import { projectsPageContent } from '@/config/projects';
import { cn } from '@/lib/cn';
import type { Sector } from '@/types';

interface ProjectsSectorFilterProps {
  sectors: Sector[];
  activeSector?: string;
  className?: string;
}

function buildProjectsUrl(sector?: string): string {
  if (!sector) return '/projets';
  return `/projets?sector=${encodeURIComponent(sector)}`;
}

export function ProjectsRefineFilter({
  sectors,
  activeSector,
  className,
}: ProjectsSectorFilterProps) {
  const { listing } = projectsPageContent;
  const router = useRouter();

  const handleSectorChange = (value: string) => {
    router.push(buildProjectsUrl(value || undefined));
  };

  return (
    <aside className={cn('projects-refine', className)} aria-label={listing.refineTitle}>
      <p className="projects-refine__title">{listing.refineTitle}</p>

      <div className="projects-refine__field">
        <label htmlFor="projects-filter-sector" className="projects-refine__label">
          {listing.sectorLabel}
        </label>
        <div className="projects-refine__control-wrap">
          <select
            id="projects-filter-sector"
            value={activeSector ?? ''}
            onChange={(e) => handleSectorChange(e.target.value)}
            className="projects-refine__control"
          >
            <option value="">{listing.allSectorsLabel}</option>
            {sectors.map((sector) => (
              <option key={sector.id} value={sector.slug}>
                {sector.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </aside>
  );
}

/** @deprecated Utiliser ProjectsRefineFilter */
export function ProjectsSectorFilter(props: ProjectsSectorFilterProps) {
  return <ProjectsRefineFilter {...props} />;
}
