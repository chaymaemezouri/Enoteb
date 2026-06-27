'use client';

import { SlidersHorizontal } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { projectsPageContent } from '@/config/projects';
import { cn } from '@/lib/cn';
import type { Sector } from '@/types';
import { ProjectsFiltersNav } from './ProjectsFiltersNav';
import { ProjectsSearchBar } from './ProjectsSearchBar';

interface ProjectsCatalogToolbarProps {
  sectors: Sector[];
  activeSector?: Sector;
  searchQuery?: string;
}

export function ProjectsCatalogToolbar({
  sectors,
  activeSector,
  searchQuery,
}: ProjectsCatalogToolbarProps) {
  const { listing } = projectsPageContent;
  const panelId = useId();
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const hasActiveFilter = Boolean(activeSector);

  useEffect(() => {
    setFiltersOpen(false);
  }, [activeSector?.slug, searchQuery]);

  useEffect(() => {
    if (!filtersOpen) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (!toolbarRef.current?.contains(event.target as Node)) {
        setFiltersOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setFiltersOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [filtersOpen]);

  return (
    <div ref={toolbarRef} className="projects-toolbar">
      <div className="projects-toolbar__search-row">
        <ProjectsSearchBar activeSector={activeSector} initialQuery={searchQuery} />

        <button
          type="button"
          className={cn(
            'projects-toolbar__filter lg:hidden',
            filtersOpen && 'projects-toolbar__filter--open',
            hasActiveFilter && 'projects-toolbar__filter--active',
          )}
          aria-expanded={filtersOpen}
          aria-controls={panelId}
          aria-haspopup="true"
          aria-label={listing.filtersToggleLabel}
          onClick={() => setFiltersOpen((open) => !open)}
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden />
          {hasActiveFilter ? (
            <span className="projects-toolbar__filter-dot" aria-hidden />
          ) : null}
        </button>
      </div>

      {filtersOpen ? (
        <div
          id={panelId}
          className="projects-toolbar__panel lg:hidden"
          role="dialog"
          aria-label={listing.filterLabel}
        >
          <p className="projects-filters__title projects-toolbar__panel-title">
            <span>{listing.filterLabel}</span>
          </p>

          <ProjectsFiltersNav
            sectors={sectors}
            activeSector={activeSector}
            searchQuery={searchQuery}
            onNavigate={() => setFiltersOpen(false)}
          />
        </div>
      ) : null}
    </div>
  );
}
