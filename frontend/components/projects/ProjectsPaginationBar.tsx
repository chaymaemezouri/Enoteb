'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { PaginationMeta } from '@/types';

interface ProjectsPaginationBarProps {
  meta: PaginationMeta;
  sector?: string;
}

function buildPageUrl(page: number, sector?: string): string {
  const params = new URLSearchParams();
  if (sector) params.set('sector', sector);
  if (page > 1) params.set('page', String(page));
  const query = params.toString();
  return query ? `/projets?${query}` : '/projets';
}

export function ProjectsPaginationBar({ meta, sector }: ProjectsPaginationBarProps) {
  if (meta.totalPages <= 1) return null;

  const pages = Array.from({ length: meta.totalPages }, (_, index) => index + 1);
  const maxVisiblePages = 7;
  const visiblePages =
    meta.totalPages <= maxVisiblePages
      ? pages
      : pages.slice(Math.max(0, meta.page - 4), Math.min(meta.totalPages, meta.page + 3));

  const showLeadingEllipsis = visiblePages[0] > 1;
  const showTrailingEllipsis = visiblePages[visiblePages.length - 1] < meta.totalPages;

  return (
    <nav
      className="projects-pagination mt-12 border-t border-[#18212B]/10 pt-10"
      aria-label="Pagination des projets"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <p className="projects-pagination__meta text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-[#68717D]">
          Page{' '}
          <span className="tabular-nums text-[#18212B]">{String(meta.page).padStart(2, '0')}</span>
          <span className="mx-1.5 text-[#18212B]/25">/</span>
          <span className="tabular-nums text-[#18212B]/55">
            {String(meta.totalPages).padStart(2, '0')}
          </span>
          <span className="mx-3 hidden text-[#18212B]/15 sm:inline" aria-hidden>
            |
          </span>
          <span className="hidden sm:inline">
            {meta.total} projet{meta.total > 1 ? 's' : ''}
          </span>
        </p>

        <div className="projects-pagination__bar inline-flex max-w-full items-stretch overflow-x-auto border border-[#18212B]/12 bg-[#08111A]/[0.03] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {meta.page > 1 ? (
            <Link
              href={buildPageUrl(meta.page - 1, sector)}
              className="projects-pagination__btn projects-pagination__btn--nav link-focus"
            >
              <ChevronLeft className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden />
              <span className="hidden sm:inline">Précédent</span>
            </Link>
          ) : (
            <span
              className="projects-pagination__btn projects-pagination__btn--nav cursor-not-allowed opacity-35"
              aria-disabled="true"
            >
              <ChevronLeft className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden />
              <span className="hidden sm:inline">Précédent</span>
            </span>
          )}

          <span className="projects-pagination__divider" aria-hidden />

          {showLeadingEllipsis ? (
            <>
              <Link
                href={buildPageUrl(1, sector)}
                className="projects-pagination__btn projects-pagination__btn--page link-focus"
              >
                01
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
                href={buildPageUrl(page, sector)}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'projects-pagination__btn projects-pagination__btn--page link-focus tabular-nums',
                  isActive && 'projects-pagination__btn--active',
                )}
              >
                {String(page).padStart(2, '0')}
              </Link>
            );
          })}

          {showTrailingEllipsis ? (
            <>
              <span className="projects-pagination__ellipsis" aria-hidden>
                …
              </span>
              <Link
                href={buildPageUrl(meta.totalPages, sector)}
                className="projects-pagination__btn projects-pagination__btn--page link-focus"
              >
                {String(meta.totalPages).padStart(2, '0')}
              </Link>
            </>
          ) : null}

          <span className="projects-pagination__divider" aria-hidden />

          {meta.page < meta.totalPages ? (
            <Link
              href={buildPageUrl(meta.page + 1, sector)}
              className="projects-pagination__btn projects-pagination__btn--nav link-focus"
            >
              <span className="hidden sm:inline">Suivant</span>
              <ChevronRight className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden />
            </Link>
          ) : (
            <span
              className="projects-pagination__btn projects-pagination__btn--nav cursor-not-allowed opacity-35"
              aria-disabled="true"
            >
              <span className="hidden sm:inline">Suivant</span>
              <ChevronRight className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden />
            </span>
          )}
        </div>
      </div>

      <p className="mt-3 text-[0.75rem] text-[#68717D] sm:hidden">
        {meta.total} projet{meta.total > 1 ? 's' : ''}
      </p>
    </nav>
  );
}
