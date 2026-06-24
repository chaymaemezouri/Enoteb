'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { AdminAuthGate, AdminShell, ConfirmModal } from '@/components/admin';
import { Button } from '@/components/ui/Button';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { adminApi } from '@/lib/admin-api';
import { formatAdminDate, formatAdminError } from '@/lib/admin-utils';
import type { AdminProjectListItem } from '@/types/admin';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<AdminProjectListItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingDelete, setPendingDelete] = useState<AdminProjectListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function loadProjects() {
    setIsLoading(true);
    setError(null);

    try {
      const list = await adminApi.listProjects();
      setProjects(list);
    } catch (loadError) {
      setError(formatAdminError(loadError));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadProjects();
  }, []);

  async function handleTogglePublish(project: AdminProjectListItem) {
    setBusyId(project.id);
    setError(null);

    try {
      await adminApi.updateProject(project.id, {
        isPublished: !project.isPublished,
      });
      await loadProjects();
    } catch (toggleError) {
      setError(formatAdminError(toggleError));
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
    } catch (deleteError) {
      setError(formatAdminError(deleteError));
      setPendingDelete(null);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AdminAuthGate>
      <AdminShell>
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-title text-neutral-900">Projets</h2>
              <p className="mt-1 text-body text-neutral-600">
                Gérez tous les projets, publiés ou en brouillon.
              </p>
            </div>

            <ButtonLink href="/admin/projects/new" size="lg">
              <Plus className="h-5 w-5" aria-hidden />
              Ajouter un projet
            </ButtonLink>
          </div>

          {error ? (
            <div
              role="alert"
              className="rounded-button border border-red-200 bg-red-50 px-4 py-3 text-body text-red-700"
            >
              {error}
            </div>
          ) : null}

          <div className="overflow-hidden rounded-card border border-neutral-200 bg-white">
            {isLoading ? (
              <p className="p-6 text-body text-neutral-700">Chargement des projets…</p>
            ) : projects.length === 0 ? (
              <p className="p-6 text-body text-neutral-600">
                Aucun projet enregistré pour le moment.
              </p>
            ) : (
              <>
                <div className="space-y-4 p-4 md:hidden">
                  {projects.map((project) => (
                    <article
                      key={project.id}
                      className="rounded-card border border-neutral-200 bg-white p-4"
                    >
                      <div className="flex flex-col gap-3">
                        <div>
                          <h3 className="text-subtitle font-semibold text-neutral-900">
                            {project.name}
                          </h3>
                          <p className="mt-1 text-body-sm text-neutral-600">
                            {project.sector?.name ?? '—'} · {project.location}
                          </p>
                          <p className="mt-1 text-body-sm text-neutral-500">
                            Modifié le {formatAdminDate(project.updatedAt)}
                          </p>
                        </div>
                        <span
                          className={
                            project.isPublished
                              ? 'w-fit rounded-full bg-green-100 px-3 py-1 text-body-sm font-medium text-green-800'
                              : 'w-fit rounded-full bg-neutral-100 px-3 py-1 text-body-sm font-medium text-neutral-700'
                          }
                        >
                          {project.isPublished ? 'Publié' : 'Brouillon'}
                        </span>
                        <div className="flex flex-col gap-2">
                          <ButtonLink
                            href={`/admin/projects/${project.id}/edit`}
                            variant="outline"
                            size="lg"
                          >
                            Modifier
                          </ButtonLink>
                          <Button
                            type="button"
                            variant="secondary"
                            size="lg"
                            disabled={busyId === project.id}
                            onClick={() => void handleTogglePublish(project)}
                          >
                            {busyId === project.id
                              ? 'Mise à jour…'
                              : project.isPublished
                                ? 'Dépublier'
                                : 'Publier'}
                          </Button>
                          <Button
                            type="button"
                            variant="danger"
                            size="lg"
                            onClick={() => setPendingDelete(project)}
                          >
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="hidden overflow-x-auto md:block">
                  <table className="min-w-full text-left text-body">
                    <thead className="border-b border-neutral-200 bg-neutral-50 text-body-sm font-semibold text-neutral-700">
                      <tr>
                        <th className="px-4 py-3">Nom</th>
                        <th className="px-4 py-3">Secteur</th>
                        <th className="px-4 py-3">Localisation</th>
                        <th className="px-4 py-3">Statut</th>
                        <th className="px-4 py-3">Dernière modification</th>
                        <th className="px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {projects.map((project) => (
                        <tr key={project.id}>
                          <td className="px-4 py-4 font-medium text-neutral-900">{project.name}</td>
                          <td className="px-4 py-4 text-neutral-700">
                            {project.sector?.name ?? '—'}
                          </td>
                          <td className="px-4 py-4 text-neutral-700">{project.location}</td>
                          <td className="px-4 py-4">
                            <span
                              className={
                                project.isPublished
                                  ? 'rounded-full bg-green-100 px-3 py-1 text-body-sm font-medium text-green-800'
                                  : 'rounded-full bg-neutral-100 px-3 py-1 text-body-sm font-medium text-neutral-700'
                              }
                            >
                              {project.isPublished ? 'Publié' : 'Brouillon'}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-neutral-700">
                            {formatAdminDate(project.updatedAt)}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex min-w-[220px] flex-col gap-2">
                              <ButtonLink
                                href={`/admin/projects/${project.id}/edit`}
                                variant="outline"
                                size="sm"
                              >
                                Modifier
                              </ButtonLink>
                              <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                disabled={busyId === project.id}
                                onClick={() => void handleTogglePublish(project)}
                              >
                                {busyId === project.id
                                  ? 'Mise à jour…'
                                  : project.isPublished
                                    ? 'Dépublier'
                                    : 'Publier'}
                              </Button>
                              <Button
                                type="button"
                                variant="danger"
                                size="sm"
                                onClick={() => setPendingDelete(project)}
                              >
                                Supprimer
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>

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
