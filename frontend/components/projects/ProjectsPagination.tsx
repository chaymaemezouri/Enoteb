import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { PaginationMeta } from '@/types';

interface ProjectsPaginationProps {
  meta: PaginationMeta;
  sector?: string;
}

function buildPageUrl(page: number, sector?: string): string {
  const params = new URLSearchParams();

  if (sector) {
    params.set('sector', sector);
  }

  if (page > 1) {
    params.set('page', String(page));
  }

  const query = params.toString();
  return query ? `/projets?${query}` : '/projets';
}

const controlClass =
  'link-focus inline-flex h-11 min-h-11 items-center gap-1 rounded-button border border-border px-3 text-body-sm font-medium transition-colors';

export function ProjectsPagination({ meta, sector }: ProjectsPaginationProps) {
  if (meta.totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: meta.totalPages }, (_, index) => index + 1);
  const maxVisiblePages = 7;
  const visiblePages =
    meta.totalPages <= maxVisiblePages
      ? pages
      : pages.slice(Math.max(0, meta.page - 4), Math.min(meta.totalPages, meta.page + 3));

  return (
    <nav className="mt-12 flex flex-col items-center gap-4" aria-label="Pagination des projets">
      <p className="text-body-sm text-neutral-500">
        Page {meta.page} sur {meta.totalPages} — {meta.total} projet
        {meta.total > 1 ? 's' : ''}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {meta.page > 1 ? (
          <Link
            href={buildPageUrl(meta.page - 1, sector)}
            className={cn(controlClass, 'hover:bg-neutral-50')}
          >
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
              'link-focus inline-flex h-11 min-h-11 min-w-11 items-center justify-center rounded-button px-3 text-body-sm font-medium transition-colors',
              page === meta.page
                ? 'bg-accent text-accent-foreground'
                : 'border border-border hover:bg-neutral-50',
            )}
          >
            {page}
          </Link>
        ))}

        {meta.page < meta.totalPages ? (
          <Link
            href={buildPageUrl(meta.page + 1, sector)}
            className={cn(controlClass, 'hover:bg-neutral-50')}
          >
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
