'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import { buildProjectsUrl } from '@/lib/projects-url';
import type { PaginationMeta } from '@/types';

interface ProjectsPaginationBarProps {
  meta: PaginationMeta;
  sector?: string;
  q?: string;
}

export function ProjectsPaginationBar({ meta, sector, q }: ProjectsPaginationBarProps) {
  if (meta.totalPages <= 1) return null;

  const pages = Array.from({ length: meta.totalPages }, (_, index) => index + 1);
  const maxVisiblePages = 5;
  const visiblePages =
    meta.totalPages <= maxVisiblePages
      ? pages
      : pages.slice(Math.max(0, meta.page - 3), Math.min(meta.totalPages, meta.page + 2));

  const showLeadingEllipsis = visiblePages[0] > 1;
  const showTrailingEllipsis = visiblePages[visiblePages.length - 1] < meta.totalPages;

  const pageUrl = (page: number) => buildProjectsUrl({ sector, page, q });

  const navButtonClass = (enabled: boolean) =>
    cn(
      'projects-pagination__nav',
      !enabled && 'projects-pagination__nav--disabled',
    );

  return (
    <nav className="projects-pagination" aria-label="Pagination des projets">
      <div className="projects-pagination__controls">
        {meta.page > 1 ? (
          <Link href={pageUrl(meta.page - 1)} className={navButtonClass(true)}>
            <ChevronLeft className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
            <span className="projects-pagination__nav-label">Précédent</span>
          </Link>
        ) : (
          <span className={navButtonClass(false)} aria-disabled="true">
            <ChevronLeft className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
            <span className="projects-pagination__nav-label">Précédent</span>
          </span>
        )}

        <div className="projects-pagination__indicator sm:hidden" aria-hidden>
          <span className="tabular-nums">{meta.page}</span>
          <span className="projects-pagination__indicator-sep">/</span>
          <span className="tabular-nums">{meta.totalPages}</span>
        </div>

        <div className="projects-pagination__pages hidden sm:flex">
          {showLeadingEllipsis ? (
            <>
              <Link href={pageUrl(1)} className="projects-pagination__page">
                1
              </Link>
              <span className="projects-pagination__ellipsis" aria-hidden>
                …
              </span>
            </>
          ) : null}

          {visiblePages.map((page) => {
            const isActive = page === meta.page;

            return (
              <Link
                key={page}
                href={pageUrl(page)}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'projects-pagination__page tabular-nums',
                  isActive && 'projects-pagination__page--active',
                )}
              >
                {page}
              </Link>
            );
          })}

          {showTrailingEllipsis ? (
            <>
              <span className="projects-pagination__ellipsis" aria-hidden>
                …
              </span>
              <Link href={pageUrl(meta.totalPages)} className="projects-pagination__page">
                {meta.totalPages}
              </Link>
            </>
          ) : null}
        </div>

        {meta.page < meta.totalPages ? (
          <Link href={pageUrl(meta.page + 1)} className={navButtonClass(true)}>
            <span className="projects-pagination__nav-label">Suivant</span>
            <ChevronRight className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
          </Link>
        ) : (
          <span className={navButtonClass(false)} aria-disabled="true">
            <span className="projects-pagination__nav-label">Suivant</span>
            <ChevronRight className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
          </span>
        )}
      </div>

      <p className="projects-pagination__meta">
        Page <span className="projects-pagination__meta-current">{meta.page}</span> sur {meta.totalPages}
        <span className="projects-pagination__meta-dot" aria-hidden>
          ·
        </span>
        {meta.total} projet{meta.total > 1 ? 's' : ''}
      </p>
    </nav>
  );
}
