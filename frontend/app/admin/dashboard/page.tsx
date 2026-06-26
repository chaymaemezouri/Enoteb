'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Eye,
  EyeOff,
  FileEdit,
  FolderKanban,
  Inbox,
  Layers,
  Plus,
  Pencil,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  AdminAuthGate,
  AdminIconButton,
  AdminPageHeader,
  AdminShell,
  useAdminToast,
} from '@/components/admin';
import { adminApi } from '@/lib/admin-api';
import { formatAdminDate, formatAdminError } from '@/lib/admin-utils';
import type { AdminDashboard } from '@/types/admin';

const quickLinks: Array<{
  href: string;
  label: string;
  hint: string;
  icon: typeof Plus;
  accent?: boolean;
}> = [
  {
    href: '/admin/projects/new',
    label: 'Nouveau projet',
    hint: 'Créer une réalisation',
    icon: Plus,
    accent: true,
  },
  {
    href: '/admin/projects',
    label: 'Projets',
    hint: 'Liste et publication',
    icon: FolderKanban,
  },
  {
    href: '/admin/demandes',
    label: 'Demandes',
    hint: 'Messages contact',
    icon: Inbox,
  },
  {
    href: '/admin/sectors',
    label: 'Secteurs',
    hint: 'Domaines d\'activité',
    icon: Layers,
  },
];

export default function AdminDashboardPage() {
  const { showToast } = useAdminToast();
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
          const message = formatAdminError(loadError);
          setError(message);
          showToast(message, 'error');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void load();
  }, [showToast]);

  const today = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());

  return (
    <AdminAuthGate>
      <AdminShell>
        <AdminPageHeader
          label="Tableau de bord"
          title="Vue d'ensemble"
          lead={`Bienvenue dans votre espace de gestion · ${today}`}
          actions={
            <Link href="/admin/projects/new" className="admin-btn admin-btn--primary admin-btn--sm">
              <Plus className="h-3.5 w-3.5" aria-hidden />
              Nouveau projet
            </Link>
          }
        />

        {isLoading ? <p className="admin-loading-text">Chargement…</p> : null}

        {error ? (
          <div role="alert" className="admin-alert">
            {error}
          </div>
        ) : null}

        {data ? (
          <div className="admin-dash">
            {data.unreadContactCount > 0 ? (
              <Link href="/admin/demandes" className="admin-dash-banner">
                <span className="admin-dash-banner__icon" aria-hidden>
                  <Inbox className="h-4 w-4" />
                </span>
                <span className="admin-dash-banner__text">
                  <strong>
                    {data.unreadContactCount} demande{data.unreadContactCount > 1 ? 's' : ''} non
                    lue{data.unreadContactCount > 1 ? 's' : ''}
                  </strong>
                  <span>Consultez les messages du formulaire contact</span>
                </span>
                <ArrowRight className="admin-dash-banner__arrow h-4 w-4" aria-hidden />
              </Link>
            ) : null}

            <div className="admin-kpi-grid">
              <article className="admin-kpi admin-kpi--dark">
                <div className="admin-kpi__top">
                  <span className="admin-kpi__icon" aria-hidden>
                    <FolderKanban className="h-4 w-4" />
                  </span>
                  <span className="admin-kpi__label">Total projets</span>
                </div>
                <p className="admin-kpi__value">{data.projectCount}</p>
                <p className="admin-kpi__hint">Réalisations enregistrées</p>
              </article>

              <article className="admin-kpi admin-kpi--success">
                <div className="admin-kpi__top">
                  <span className="admin-kpi__icon admin-kpi__icon--success" aria-hidden>
                    <Eye className="h-4 w-4" />
                  </span>
                  <span className="admin-kpi__label">Publiés</span>
                </div>
                <p className="admin-kpi__value">{data.publishedCount}</p>
                <p className="admin-kpi__hint">Visibles sur le site</p>
              </article>

              <article className="admin-kpi">
                <div className="admin-kpi__top">
                  <span className="admin-kpi__icon" aria-hidden>
                    <FileEdit className="h-4 w-4" />
                  </span>
                  <span className="admin-kpi__label">Brouillons</span>
                </div>
                <p className="admin-kpi__value">{data.draftCount}</p>
                <p className="admin-kpi__hint">En attente</p>
              </article>

              <article className="admin-kpi">
                <div className="admin-kpi__top">
                  <span className="admin-kpi__icon" aria-hidden>
                    <Layers className="h-4 w-4" />
                  </span>
                  <span className="admin-kpi__label">Secteurs</span>
                </div>
                <p className="admin-kpi__value">{data.bySector.length}</p>
                <p className="admin-kpi__hint">Domaines actifs</p>
              </article>

              <article className="admin-kpi admin-kpi--accent">
                <div className="admin-kpi__top">
                  <span className="admin-kpi__icon admin-kpi__icon--accent" aria-hidden>
                    <Inbox className="h-4 w-4" />
                  </span>
                  <span className="admin-kpi__label">Demandes</span>
                </div>
                <p className="admin-kpi__value">{data.unreadContactCount}</p>
                <p className="admin-kpi__hint">Non lues</p>
              </article>
            </div>

            <nav className="admin-tiles" aria-label="Accès rapide">
              {quickLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={item.accent ? 'admin-tile admin-tile--accent' : 'admin-tile'}
                  >
                    <span className="admin-tile__icon" aria-hidden>
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="admin-tile__body">
                      <span className="admin-tile__title">{item.label}</span>
                      <span className="admin-tile__hint">{item.hint}</span>
                    </span>
                    <ArrowRight className="admin-tile__arrow h-3.5 w-3.5" aria-hidden />
                  </Link>
                );
              })}
            </nav>

            <div className="admin-dash-grid">
              <section className="admin-panel admin-panel--compact" aria-labelledby="admin-recent-projects">
                <div className="admin-panel__head">
                  <div>
                    <h2 id="admin-recent-projects" className="admin-panel__title">
                      Derniers projets
                    </h2>
                    <p className="admin-panel__subtitle">Modifications récentes</p>
                  </div>
                  <Link href="/admin/projects" className="admin-panel__action">
                    Tout voir
                    <ArrowRight className="h-3 w-3" aria-hidden />
                  </Link>
                </div>

                <div className="admin-panel__body admin-panel__body--flush">
                  {data.recentProjects.length === 0 ? (
                    <p className="admin-panel__empty">Aucun projet pour le moment.</p>
                  ) : (
                    <ul className="admin-data-list">
                      {data.recentProjects.map((project) => (
                        <li key={project.id} className="admin-data-list__row">
                          <div className="admin-data-list__main">
                            <Link
                              href={`/admin/projects/${project.id}/edit`}
                              className="admin-data-list__title"
                            >
                              {project.name}
                            </Link>
                            <p className="admin-data-list__meta">
                              {project.sector?.name ?? 'Sans secteur'} ·{' '}
                              {formatAdminDate(project.updatedAt)}
                            </p>
                          </div>
                          <div className="admin-data-list__side">
                            <span
                              className={
                                project.isPublished
                                  ? 'admin-badge admin-badge--published'
                                  : 'admin-badge admin-badge--draft'
                              }
                            >
                              {project.isPublished ? 'Publié' : 'Brouillon'}
                            </span>
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
                                  <Eye className="h-3.5 w-3.5" />
                                </AdminIconButton>
                              ) : (
                                <span
                                  className="admin-icon-btn admin-icon-btn--ghost admin-icon-btn--disabled"
                                  title="Non publié"
                                  aria-hidden
                                >
                                  <EyeOff className="h-3.5 w-3.5 opacity-30" />
                                </span>
                              )}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>

              <section className="admin-panel admin-panel--compact" aria-labelledby="admin-sectors-breakdown">
                <div className="admin-panel__head">
                  <div>
                    <h2 id="admin-sectors-breakdown" className="admin-panel__title">
                      Par secteur
                    </h2>
                    <p className="admin-panel__subtitle">Répartition des projets</p>
                  </div>
                  <Link href="/admin/sectors" className="admin-panel__action">
                    Gérer
                    <ArrowRight className="h-3 w-3" aria-hidden />
                  </Link>
                </div>

                <div className="admin-panel__body admin-panel__body--flush">
                  {data.bySector.length === 0 ? (
                    <p className="admin-panel__empty">Aucun secteur configuré.</p>
                  ) : (
                    <ul className="admin-sector-bars">
                      {data.bySector.map((sector) => {
                        const pct =
                          data.projectCount > 0
                            ? Math.round((sector.projectCount / data.projectCount) * 100)
                            : 0;

                        return (
                          <li key={sector.id} className="admin-sector-bars__item">
                            <div className="admin-sector-bars__head">
                              <span className="admin-sector-bars__name">{sector.name}</span>
                              <span className="admin-sector-bars__count">
                                {sector.projectCount}
                              </span>
                            </div>
                            <div className="admin-sector-bars__track" aria-hidden>
                              <span
                                className="admin-sector-bars__fill"
                                style={{ width: `${Math.max(pct, sector.projectCount > 0 ? 8 : 0)}%` }}
                              />
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </section>
            </div>
          </div>
        ) : null}
      </AdminShell>
    </AdminAuthGate>
  );
}
