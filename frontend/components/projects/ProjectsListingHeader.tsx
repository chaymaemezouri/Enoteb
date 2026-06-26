import { projectsPageContent } from '@/config/projects';
import type { Sector } from '@/types';

interface ProjectsListingHeaderProps {
  activeSector?: Sector;
  total: number;
}

export function ProjectsListingHeader({ activeSector, total }: ProjectsListingHeaderProps) {
  const { listing } = projectsPageContent;
  const countLabel = total === 1 ? listing.resultsLabel : listing.resultsLabelPlural;

  return (
    <header className="projects-listing__head flex flex-wrap items-end justify-between gap-4 border-b border-[#18212B]/8 pb-6 sm:pb-7">
      <p className="max-w-lg text-[0.875rem] leading-relaxed text-[#68717D] sm:text-[0.9375rem]">
        {listing.subtitle}
      </p>

      {total > 0 ? (
        <p className="shrink-0 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[#68717D]">
          <span className="tabular-nums text-[#18212B]">{total}</span> {countLabel}
          {activeSector ? (
            <span className="text-[#18212B]/35"> · </span>
          ) : null}
          {activeSector ? <span className="text-[#FF6A1A]">{activeSector.name}</span> : null}
        </p>
      ) : null}
    </header>
  );
}
