'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AdminAuthGate, AdminShell } from '@/components/admin';
import { adminApi } from '@/lib/admin-api';
import { formatAdminDate, formatAdminError } from '@/lib/admin-utils';
import type { AdminDashboard } from '@/types/admin';

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminDashboard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const dashboard = await adminApi.getDashboard();
        if (!cancelled) {
          setData(dashboard);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(formatAdminError(loadError));
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AdminAuthGate>
      <AdminShell>
        <div className="space-y-6">
          <div>
            <h2 className="text-title text-neutral-900">Tableau de bord</h2>
            <p className="mt-1 text-body text-neutral-600">
              Vue d’ensemble de vos projets et secteurs.
            </p>
          </div>

          {isLoading ? (
            <p className="text-body text-neutral-700">Chargement des statistiques…</p>
          ) : null}

          {error ? (
            <div
              role="alert"
              className="rounded-button border border-red-200 bg-red-50 px-4 py-3 text-body text-red-700"
            >
              {error}
            </div>
          ) : null}

          {data ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-card border border-neutral-200 bg-white p-6">
                  <p className="text-body-sm text-neutral-600">Nombre de projets</p>
                  <p className="mt-2 text-display text-neutral-900">{data.projectCount}</p>
                </div>

                {data.bySector.map((sector) => (
                  <div
                    key={sector.id}
                    className="rounded-card border border-neutral-200 bg-white p-6"
                  >
                    <p className="text-body-sm text-neutral-600">{sector.name}</p>
                    <p className="mt-2 text-display text-neutral-900">{sector.projectCount}</p>
                    <p className="mt-1 text-body-sm text-neutral-500">projet(s)</p>
                  </div>
                ))}
              </div>

              <section className="rounded-card border border-neutral-200 bg-white p-6">
                <h3 className="text-subtitle font-semibold text-neutral-900">
                  Derniers projets modifiés
                </h3>

                {data.recentProjects.length === 0 ? (
                  <p className="mt-4 text-body text-neutral-600">Aucun projet pour le moment.</p>
                ) : (
                  <ul className="mt-4 divide-y divide-neutral-200">
                    {data.recentProjects.map((project) => (
                      <li
                        key={project.id}
                        className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <Link
                            href={`/admin/projects/${project.id}/edit`}
                            className="text-body font-medium text-accent-700 hover:underline"
                          >
                            {project.name}
                          </Link>
                          <p className="text-body-sm text-neutral-600">
                            {project.sector?.name ?? 'Sans secteur'} ·{' '}
                            {formatAdminDate(project.updatedAt)}
                          </p>
                        </div>
                        <span
                          className={
                            project.isPublished
                              ? 'inline-flex rounded-full bg-green-100 px-3 py-1 text-body-sm font-medium text-green-800'
                              : 'inline-flex rounded-full bg-neutral-100 px-3 py-1 text-body-sm font-medium text-neutral-700'
                          }
                        >
                          {project.isPublished ? 'Publié' : 'Brouillon'}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </>
          ) : null}
        </div>
      </AdminShell>
    </AdminAuthGate>
  );
}
