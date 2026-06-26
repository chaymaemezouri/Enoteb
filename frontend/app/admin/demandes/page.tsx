'use client';

import { useEffect, useMemo, useState } from 'react';
import { Check, Mail, MailOpen, Phone, Building2, Trash2 } from 'lucide-react';
import {
  AdminAuthGate,
  AdminIconButton,
  AdminPageHeader,
  AdminShell,
  ConfirmModal,
  useAdminToast,
} from '@/components/admin';
import { adminApi } from '@/lib/admin-api';
import { formatAdminDate, formatAdminError } from '@/lib/admin-utils';
import { cn } from '@/lib/cn';
import type { AdminContactRequest } from '@/types/admin';

type Filter = 'all' | 'unread';

export default function AdminDemandesPage() {
  const { showToast } = useAdminToast();
  const [items, setItems] = useState<AdminContactRequest[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState<Filter>('all');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingDelete, setPendingDelete] = useState<AdminContactRequest | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const activeItem = items.find((item) => item.id === activeId) ?? items[0];

  async function loadRequests(nextFilter: Filter = filter) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await adminApi.listContactRequests(nextFilter);
      setItems(response.items);
      setUnreadCount(response.unreadCount);

      if (response.items.length === 0) {
        setActiveId(null);
      } else if (!response.items.some((item) => item.id === activeId)) {
        setActiveId(response.items[0].id);
      }
    } catch (loadError) {
      const message = formatAdminError(loadError);
      setError(message);
      showToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadRequests();
  }, [filter]);

  async function openRequest(request: AdminContactRequest) {
    setActiveId(request.id);

    if (!request.isRead) {
      setBusyId(request.id);
      try {
        const updated = await adminApi.markContactRequestRead(request.id, true);
        setItems((current) =>
          current.map((item) => (item.id === updated.id ? updated : item)),
        );
        setUnreadCount((count) => Math.max(0, count - 1));
      } catch (markError) {
        showToast(formatAdminError(markError), 'error');
      } finally {
        setBusyId(null);
      }
    }
  }

  async function toggleRead(request: AdminContactRequest) {
    setBusyId(request.id);

    try {
      const updated = await adminApi.markContactRequestRead(request.id, !request.isRead);
      setItems((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      setUnreadCount((count) => (updated.isRead ? Math.max(0, count - 1) : count + 1));
      showToast(updated.isRead ? 'Marquée comme lue.' : 'Marquée comme non lue.', 'success');
    } catch (toggleError) {
      showToast(formatAdminError(toggleError), 'error');
    } finally {
      setBusyId(null);
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) {
      return;
    }

    setIsDeleting(true);

    try {
      await adminApi.deleteContactRequest(pendingDelete.id);
      setPendingDelete(null);
      showToast('Demande supprimée.', 'success');
      await loadRequests();
    } catch (deleteError) {
      showToast(formatAdminError(deleteError), 'error');
      setPendingDelete(null);
    } finally {
      setIsDeleting(false);
    }
  }

  const filterLabel = useMemo(
    () => (filter === 'unread' ? 'Non lues' : 'Toutes'),
    [filter],
  );

  return (
    <AdminAuthGate>
      <AdminShell>
        <AdminPageHeader
          label="Demandes"
          title="Messages de contact"
          lead="Demandes de projet et messages envoyés via le formulaire du site."
        />

        <div className="admin-toolbar">
          <select
            className="admin-toolbar__select"
            value={filter}
            onChange={(event) => setFilter(event.target.value as Filter)}
            aria-label="Filtrer les demandes"
          >
            <option value="all">Toutes les demandes</option>
            <option value="unread">Non lues ({unreadCount})</option>
          </select>
          <p className="admin-toolbar__meta">
            {items.length} {filterLabel.toLowerCase()}
          </p>
        </div>

        {error ? (
          <div role="alert" className="admin-alert">
            {error}
          </div>
        ) : null}

        {isLoading ? (
          <p className="admin-loading-text">Chargement des demandes…</p>
        ) : items.length === 0 ? (
          <div className="admin-demandes__empty">
            Aucune demande {filter === 'unread' ? 'non lue' : 'pour le moment'}.
          </div>
        ) : (
          <div className="admin-demandes">
            <div className="admin-demandes__list" role="list">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="listitem"
                  className={cn(
                    'admin-demandes__item',
                    item.id === activeItem?.id && 'admin-demandes__item--active',
                    !item.isRead && 'admin-demandes__item--unread',
                  )}
                  disabled={busyId === item.id}
                  onClick={() => void openRequest(item)}
                >
                  <div className="admin-demandes__item-head">
                    <span className="admin-demandes__item-name">{item.name}</span>
                    <span className="admin-demandes__item-date">
                      {formatAdminDate(item.createdAt)}
                    </span>
                  </div>
                  <p className="admin-demandes__item-preview">{item.message}</p>
                  {!item.isRead ? (
                    <span className="admin-badge admin-badge--draft">Nouveau</span>
                  ) : null}
                </button>
              ))}
            </div>

            {activeItem ? (
              <article className="admin-demandes__detail">
                <header className="admin-demandes__detail-head">
                  <div>
                    <h2 className="admin-demandes__detail-title">{activeItem.name}</h2>
                    <p className="admin-demandes__detail-meta">
                      Reçu le {formatAdminDate(activeItem.createdAt)}
                      {!activeItem.isRead ? ' · Non lu' : ''}
                    </p>
                  </div>
                  <span
                    className={
                      activeItem.isRead
                        ? 'admin-badge admin-badge--published'
                        : 'admin-badge admin-badge--draft'
                    }
                  >
                    {activeItem.isRead ? 'Lu' : 'Nouveau'}
                  </span>
                </header>

                <div className="admin-demandes__detail-body">
                  <div className="admin-demandes__detail-grid">
                    <div className="admin-demandes__field">
                      <p className="admin-demandes__field-label">
                        <Mail className="h-3 w-3" aria-hidden />
                        Email
                      </p>
                      <p className="admin-demandes__field-value">
                        <a href={`mailto:${activeItem.email}`} className="admin-link-external">
                          {activeItem.email}
                        </a>
                      </p>
                    </div>
                    <div className="admin-demandes__field">
                      <p className="admin-demandes__field-label">
                        <Phone className="h-3 w-3" aria-hidden />
                        Téléphone
                      </p>
                      <p className="admin-demandes__field-value">
                        {activeItem.phone ?? '—'}
                      </p>
                    </div>
                    <div className="admin-demandes__field">
                      <p className="admin-demandes__field-label">
                        <Building2 className="h-3 w-3" aria-hidden />
                        Entreprise
                      </p>
                      <p className="admin-demandes__field-value">
                        {activeItem.company ?? '—'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="admin-demandes__field-label">Message</p>
                    <div className="admin-demandes__message">{activeItem.message}</div>
                  </div>
                </div>

                <footer className="admin-demandes__detail-foot">
                  <a
                    href={`mailto:${activeItem.email}?subject=${encodeURIComponent(`Réponse à votre demande ENOTEB`)}`}
                    className="admin-btn admin-btn--primary admin-btn--sm"
                  >
                    <Mail className="h-3.5 w-3.5" aria-hidden />
                    Répondre
                  </a>
                  <AdminIconButton
                    label={activeItem.isRead ? 'Marquer non lu' : 'Marquer comme lu'}
                    variant="secondary"
                    disabled={busyId === activeItem.id}
                    onClick={() => void toggleRead(activeItem)}
                  >
                    {activeItem.isRead ? (
                      <MailOpen className="h-3.5 w-3.5" />
                    ) : (
                      <Check className="h-3.5 w-3.5" />
                    )}
                  </AdminIconButton>
                  <AdminIconButton
                    label="Supprimer"
                    variant="danger"
                    onClick={() => setPendingDelete(activeItem)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </AdminIconButton>
                </footer>
              </article>
            ) : null}
          </div>
        )}

        <ConfirmModal
          open={Boolean(pendingDelete)}
          title="Supprimer cette demande ?"
          message={
            pendingDelete
              ? `Le message de « ${pendingDelete.name} » sera définitivement supprimé.`
              : ''
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
