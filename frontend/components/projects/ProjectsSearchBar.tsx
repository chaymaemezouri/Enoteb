'use client';

import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { projectsPageContent } from '@/config/projects';
import { buildProjectsUrl } from '@/lib/projects-url';
import type { Sector } from '@/types';

interface ProjectsSearchBarProps {
  activeSector?: Sector;
  initialQuery?: string;
}

export function ProjectsSearchBar({ activeSector, initialQuery = '' }: ProjectsSearchBarProps) {
  const { listing } = projectsPageContent;
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const trimmedQuery = query.trim();

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const initial = initialQuery.trim();
    if (trimmedQuery === initial) return;

    const timer = window.setTimeout(() => {
      router.push(
        buildProjectsUrl({
          sector: activeSector?.slug,
          q: trimmedQuery || undefined,
        }),
      );
    }, 400);

    return () => window.clearTimeout(timer);
  }, [trimmedQuery, initialQuery, activeSector?.slug, router]);

  return (
    <div className="projects-search-wrap">
      <div className="projects-search" role="search">
        <label className="projects-search__field">
          <Search className="h-4 w-4 shrink-0 text-[#68717D]" aria-hidden />
          <span className="sr-only">{listing.searchLabel}</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={listing.searchPlaceholder}
            className="projects-search__input"
            autoComplete="off"
          />
        </label>

        {trimmedQuery ? (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              router.push(buildProjectsUrl({ sector: activeSector?.slug }));
            }}
            className="projects-search__clear link-focus"
            aria-label={listing.clearSearchLabel}
          >
            <X className="h-3.5 w-3.5" aria-hidden />
          </button>
        ) : null}
      </div>
    </div>
  );
}
