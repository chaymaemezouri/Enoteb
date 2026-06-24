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

const controlClass =
  'link-focus inline-flex h-10 min-h-10 items-center gap-1.5 border border-[#252A30]/12 bg-white px-3 text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-[#252A30]/75 transition-colors duration-300 hover:border-[#FF6B1A]/35 hover:text-[#252A30]';

export function ProjectsPaginationBar({ meta, sector }: ProjectsPaginationBarProps) {
  if (meta.totalPages <= 1) return null;

  const pages = Array.from({ length: meta.totalPages }, (_, index) => index + 1);
  const maxVisiblePages = 7;
  const visiblePages =
    meta.totalPages <= maxVisiblePages
      ? pages
      : pages.slice(Math.max(0, meta.page - 4), Math.min(meta.totalPages, meta.page + 3));

  return (
    <nav
      className="mt-12 flex flex-col items-center gap-4 border-t border-[#252A30]/8 pt-10"
      aria-label="Pagination des projets"
    >
      <p className="text-[0.8125rem] text-[#6B7078]">
        Page {meta.page} sur {meta.totalPages} — {meta.total} projet
        {meta.total > 1 ? 's' : ''}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {meta.page > 1 ? (
          <Link href={buildPageUrl(meta.page - 1, sector)} className={controlClass}>
            <ChevronLeft className="h-4 w-4" aria-hidden />
            Précédent
          </Link>
        ) : (
          <span className={cn(controlClass, 'cursor-not-allowed opacity-40')} aria-disabled="true">
            <ChevronLeft className="h-4 w-4" aria-hidden />
            Précédent
          </span>
        )}

        {visiblePages.map((page) => (
          <Link
            key={page}
            href={buildPageUrl(page, sector)}
            aria-current={page === meta.page ? 'page' : undefined}
            className={cn(
              'link-focus inline-flex h-10 min-h-10 min-w-10 items-center justify-center px-3 text-[0.75rem] font-semibold transition-colors duration-300',
              page === meta.page
                ? 'bg-[#FF6B1A] text-white'
                : 'border border-[#252A30]/12 bg-white text-[#252A30]/75 hover:border-[#FF6B1A]/35',
            )}
          >
            {page}
          </Link>
        ))}

        {meta.page < meta.totalPages ? (
          <Link href={buildPageUrl(meta.page + 1, sector)} className={controlClass}>
            Suivant
            <ChevronRight className="h-4 w-4" aria-hidden />
          </Link>
        ) : (
          <span className={cn(controlClass, 'cursor-not-allowed opacity-40')} aria-disabled="true">
            Suivant
            <ChevronRight className="h-4 w-4" aria-hidden />
          </span>
        )}
      </div>
    </nav>
  );
}
