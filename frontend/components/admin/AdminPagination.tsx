import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AdminPaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function AdminPagination({ page, pageSize, total, onPageChange }: AdminPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  if (total <= pageSize) {
    return null;
  }

  return (
    <div className="admin-pagination">
      <p className="admin-pagination__info">
        {from}–{to} sur {total}
      </p>
      <div className="admin-pagination__controls">
        <button
          type="button"
          className="admin-icon-btn admin-icon-btn--secondary"
          disabled={page <= 1}
          aria-label="Page précédente"
          title="Précédent"
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="admin-pagination__page">
          {page} / {totalPages}
        </span>
        <button
          type="button"
          className="admin-icon-btn admin-icon-btn--secondary"
          disabled={page >= totalPages}
          aria-label="Page suivante"
          title="Suivant"
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
