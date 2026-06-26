'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ExternalLink, Eye, EyeOff, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import {
  AdminAuthGate,
  AdminIconButton,
  AdminPageHeader,
  AdminPagination,
  AdminShell,
  ConfirmModal,
  useAdminToast,
} from '@/components/admin';
import { adminApi } from '@/lib/admin-api';
import { formatAdminDate, formatAdminError } from '@/lib/admin-utils';
import type { AdminProjectListItem } from '@/types/admin';

const PAGE_SIZE = 10;

type StatusFilter = 'all' | 'published' | 'draft';

export default function AdminProjectsPage() {
  const { showToast } = useAdminToast();
  const [projects, setProjects] = useState<AdminProjectListItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingDelete, setPendingDelete] = useState<AdminProjectListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [page, setPage] = useState(1);

  async function loadProjects() {
    setIsLoading(true);
    setError(null);

    try {
      const list = await adminApi.listProjects();
      setProjects(list);
    } catch (loadError) {
      const message = formatAdminError(loadError);
      setError(message);
      showToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadProjects();
  }, []);

  const sectors = useMemo(() => {
    const map = new Map<string, string>();
    projects.forEach((project) => {
      if (project.sector) {
        map.set(project.sector.id, project.sector.name);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [projects]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return projects.filter((project) => {
      if (statusFilter === 'published' && !project.isPublished) {
        return false;
      }
      if (statusFilter === 'draft' && project.isPublished) {
        return false;
      }
      if (sectorFilter !== 'all' && project.sector?.id !== sectorFilter) {
        return false;
      }
      if (!query) {
        return true;
      }

      return (
        project.name.toLowerCase().includes(query) ||
        project.location.toLowerCase().includes(query) ||
        (project.sector?.name.toLowerCase().includes(query) ?? false)
      );
    });
  }, [projects, search, sectorFilter, statusFilter]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  useEffect(() => {
    setPage(1);
  }, [search, sectorFilter, statusFilter]);

  async function handleTogglePublish(project: AdminProjectListItem) {
    setBusyId(project.id);
    setError(null);

    try {
      await adminApi.updateProject(project.id, {
        isPublished: !project.isPublished,
      });
      await loadProjects();
      showToast(
        project.isPublished ? 'Projet dépublié.' : 'Projet publié sur le site.',
        'success',
      );
    } catch (toggleError) {
      const message = formatAdminError(toggleError);
      setError(message);
      showToast(message, 'error');
    } finally {
      setBusyId(null);
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await adminApi.deleteProject(pendingDelete.id);
      setPendingDelete(null);
      await loadProjects();
      showToast('Projet supprimé.', 'success');
    } catch (deleteError) {
      const message = formatAdminError(deleteError);
      setError(message);
      showToast(message, 'error');
      setPendingDelete(null);
    } finally {
      setIsDeleting(false);
    }
  }

  function renderActions(project: AdminProjectListItem) {
    return (
      <div className="admin-action-group">
        <AdminIconButton
          href={`/admin/projects/${project.id}/edit`}
          label="Modifier"
          variant="secondary"
        >
          <Pencil className="h-3.5 w-3.5" />
        </AdminIconButton>
        {project.isPublished ? (
          <AdminIconButton
            href={`/projets/${project.slug}`}
            label="Voir sur le site"
            variant="ghost"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </AdminIconButton>
        ) : null}
        <AdminIconButton
          label={project.isPublished ? 'Dépublier' : 'Publier'}
          variant="ghost"
          disabled={busyId === project.id}
          onClick={() => void handleTogglePublish(project)}
        >
          {project.isPublished ? (
            <EyeOff className="h-3.5 w-3.5" />
          ) : (
            <Eye className="h-3.5 w-3.5" />
          )}
        </AdminIconButton>
        <AdminIconButton
          label="Supprimer"
          variant="danger"
          onClick={() => setPendingDelete(project)}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </AdminIconButton>
      </div>
    );
  }

  return (
    <AdminAuthGate>
      <AdminShell>
        <AdminPageHeader
          label="Projets"
          title="Réalisations"
          lead="Gérez tous les projets, publiés ou en brouillon."
          actions={
            <Link href="/admin/projects/new" className="admin-btn admin-btn--primary admin-btn--sm">
              <Plus className="h-3.5 w-3.5" aria-hidden />
              Ajouter
            </Link>
          }
        />

        {error ? (
          <div role="alert" className="admin-alert">
            {error}
          </div>
        ) : null}

        <div className="admin-toolbar">
          <div className="admin-toolbar__search">
            <Search className="admin-toolbar__search-icon h-4 w-4" aria-hidden />
            <input
              type="search"
              className="admin-toolbar__input"
              placeholder="Rechercher par nom, lieu ou secteur…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <select
            className="admin-toolbar__select"
            value={sectorFilter}
            onChange={(event) => setSectorFilter(event.target.value)}
            aria-label="Filtrer par secteur"
          >
            <option value="all">Tous les secteurs</option>
            {sectors.map((sector) => (
              <option key={sector.id} value={sector.id}>
                {sector.name}
              </option>
            ))}
          </select>

          <select
            className="admin-toolbar__select"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
            aria-label="Filtrer par statut"
          >
            <option value="all">Tous les statuts</option>
            <option value="published">Publiés</option>
            <option value="draft">Brouillons</option>
          </select>

          <p className="admin-toolbar__meta">
            {filtered.length} projet{filtered.length > 1 ? 's' : ''}
          </p>
        </div>

        {isLoading ? (
          <p className="admin-loading-text">Chargement des projets…</p>
        ) : filtered.length === 0 ? (
          <div className="admin-panel">
            <p className="admin-panel__empty">
              {projects.length === 0
                ? 'Aucun projet enregistré pour le moment.'
                : 'Aucun projet ne correspond à votre recherche.'}
            </p>
          </div>
        ) : (
          <>
            <div className="admin-cards">
              {paginated.map((project) => (
                <article key={project.id} className="admin-card">
                  <h3 className="admin-card__title">{project.name}</h3>
                  <p className="admin-card__meta">
                    {project.sector?.name ?? '—'} · {project.location}
                  </p>
                  <p className="admin-card__meta">
                    Modifié le {formatAdminDate(project.updatedAt)}
                  </p>
                  <div className="admin-card__row">
                    <span
                      className={
                        project.isPublished
                          ? 'admin-badge admin-badge--published'
                          : 'admin-badge admin-badge--draft'
                      }
                    >
                      {project.isPublished ? 'Publié' : 'Brouillon'}
                    </span>
                  </div>
                  <div className="admin-card__actions">{renderActions(project)}</div>
                </article>
              ))}
            </div>

            <div className="admin-desktop-only">
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Secteur</th>
                      <th>Localisation</th>
                      <th>Statut</th>
                      <th>Modification</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((project) => (
                      <tr key={project.id}>
                        <td className="admin-table__name">{project.name}</td>
                        <td className="admin-table__muted">{project.sector?.name ?? '—'}</td>
                        <td className="admin-table__muted">{project.location}</td>
                        <td>
                          <span
                            className={
                              project.isPublished
                                ? 'admin-badge admin-badge--published'
                                : 'admin-badge admin-badge--draft'
                            }
                          >
                            {project.isPublished ? 'Publié' : 'Brouillon'}
                          </span>
                        </td>
                        <td className="admin-table__muted">
                          {formatAdminDate(project.updatedAt)}
                        </td>
                        <td>{renderActions(project)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <AdminPagination
              page={page}
              pageSize={PAGE_SIZE}
              total={filtered.length}
              onPageChange={setPage}
            />
          </>
        )}

        <ConfirmModal
          open={Boolean(pendingDelete)}
          title="Supprimer ce projet ?"
          message={
            pendingDelete ? `Le projet « ${pendingDelete.name} » sera définitivement supprimé.` : ''
          }
          confirmLabel="Oui, supprimer"
          isLoading={isDeleting}
          onConfirm={() => void confirmDelete()}
          onCancel={() => setPendingDelete(null)}
        />
      </AdminShell>
    </AdminAuthGate>
  );
}
