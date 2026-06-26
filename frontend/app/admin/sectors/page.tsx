'use client';

import { useEffect, useMemo, useState } from 'react';
import { ExternalLink, Plus, Trash2 } from 'lucide-react';
import {
  AdminAuthGate,
  AdminPageHeader,
  AdminShell,
  ConfirmModal,
  ImageUploadField,
  useAdminToast,
} from '@/components/admin';
import { useAuth } from '@/contexts/AuthContext';
import { adminApi } from '@/lib/admin-api';
import { formatAdminError, slugify } from '@/lib/admin-utils';
import { cn } from '@/lib/cn';
import type { Sector } from '@/types';

const CREATE_ID = '__create__';

interface SectorDraft {
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  order: string;
}

function buildDraft(sector: Sector): SectorDraft {
  return {
    name: sector.name,
    slug: sector.slug,
    description: sector.description,
    imageUrl: sector.imageUrl ?? '',
    order: String(sector.order),
  };
}

function emptyDraft(order: number): SectorDraft {
  return {
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    order: String(order),
  };
}

function isDraftDirty(sector: Sector | null, draft: SectorDraft | undefined): boolean {
  if (!draft) {
    return false;
  }

  if (!sector) {
    return Boolean(
      draft.name.trim() ||
        draft.slug.trim() ||
        draft.description.trim() ||
        draft.imageUrl.trim(),
    );
  }

  const saved = buildDraft(sector);
  return (
    draft.name !== saved.name ||
    draft.slug !== saved.slug ||
    draft.description !== saved.description ||
    draft.imageUrl !== saved.imageUrl ||
    draft.order !== saved.order
  );
}

function validateDraft(draft: SectorDraft): string | null {
  if (!draft.name.trim()) {
    return 'Indiquez le nom du secteur.';
  }

  if (!draft.slug.trim()) {
    return 'Indiquez l\u2019identifiant web (slug).';
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(draft.slug.trim())) {
    return 'Le slug : lettres minuscules, chiffres et tirets uniquement.';
  }

  if (!draft.description.trim()) {
    return 'La description est obligatoire.';
  }

  const orderValue = Number(draft.order);
  if (Number.isNaN(orderValue) || orderValue < 0) {
    return 'L\u2019ordre doit être un nombre positif ou zéro.';
  }

  return null;
}

export default function AdminSectorsPage() {
  const { accessToken } = useAuth();
  const { showToast } = useAdminToast();
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [drafts, setDrafts] = useState<Record<string, SectorDraft>>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Sector | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const sortedSectors = useMemo(
    () => [...sectors].sort((a, b) => a.order - b.order || a.name.localeCompare(b.name)),
    [sectors],
  );

  const isCreating = activeId === CREATE_ID;
  const activeSector = isCreating
    ? null
    : (sortedSectors.find((sector) => sector.id === activeId) ?? sortedSectors[0] ?? null);

  const editorId = isCreating ? CREATE_ID : (activeSector?.id ?? CREATE_ID);
  const activeDraft = drafts[editorId];

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const list = await adminApi.getSectors();
        if (cancelled) {
          return;
        }

        const ordered = [...list].sort((a, b) => a.order - b.order);
        setSectors(ordered);
        setDrafts(Object.fromEntries(ordered.map((sector) => [sector.id, buildDraft(sector)])));
        setActiveId(ordered[0]?.id ?? CREATE_ID);

        if (ordered.length === 0) {
          setDrafts({ [CREATE_ID]: emptyDraft(0) });
        }
      } catch (error) {
        if (!cancelled) {
          const message = formatAdminError(error);
          setGlobalError(message);
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

  function startCreate() {
    const current = activeSector;
    if (current && isDraftDirty(current, drafts[current.id])) {
      const proceed = window.confirm(
        'Modifications non enregistrées. Continuer sans enregistrer ?',
      );
      if (!proceed) {
        return;
      }
    }

    const nextOrder =
      sortedSectors.length > 0 ? Math.max(...sortedSectors.map((s) => s.order)) + 1 : 0;

    setDrafts((current) => ({
      ...current,
      [CREATE_ID]: emptyDraft(nextOrder),
    }));
    setSlugTouched((current) => ({ ...current, [CREATE_ID]: false }));
    setActiveId(CREATE_ID);
    setErrors((current) => ({ ...current, [CREATE_ID]: '' }));
  }

  function selectSector(sectorId: string) {
    if (sectorId === activeId) {
      return;
    }

    const current = activeSector;
    if (current && isDraftDirty(current, drafts[current.id])) {
      const proceed = window.confirm(
        'Ce secteur contient des modifications non enregistrées. Changer sans enregistrer ?',
      );
      if (!proceed) {
        return;
      }
    }

    if (isCreating && isDraftDirty(null, drafts[CREATE_ID])) {
      const proceed = window.confirm(
        'Le nouveau secteur n\u2019est pas enregistré. Abandonner la création ?',
      );
      if (!proceed) {
        return;
      }
    }

    setActiveId(sectorId);
    setErrors((current) => ({ ...current, [sectorId]: '' }));
  }

  function updateDraft(sectorId: string, patch: Partial<SectorDraft>) {
    setDrafts((current) => {
      const existing = current[sectorId] ?? emptyDraft(0);
      const next = { ...existing, ...patch };

      if (patch.name !== undefined && !slugTouched[sectorId]) {
        next.slug = slugify(patch.name);
      }

      return { ...current, [sectorId]: next };
    });
  }

  async function saveSector() {
    const draft = drafts[editorId];
    const validationError = validateDraft(draft);

    if (validationError) {
      setErrors((current) => ({ ...current, [editorId]: validationError }));
      return;
    }

    setSavingId(editorId);
    setErrors((current) => ({ ...current, [editorId]: '' }));
    setGlobalError(null);

    const orderValue = Number(draft.order);
    const payload = {
      name: draft.name.trim(),
      slug: draft.slug.trim(),
      description: draft.description.trim(),
      imageUrl: draft.imageUrl.trim() || undefined,
      order: orderValue,
    };

    try {
      if (isCreating) {
        const created = await adminApi.createSector(payload);
        setSectors((current) => [...current, created].sort((a, b) => a.order - b.order));
        setDrafts((current) => {
          const next = { ...current, [created.id]: buildDraft(created) };
          delete next[CREATE_ID];
          return next;
        });
        setActiveId(created.id);
        showToast(`Secteur « ${created.name} » créé.`, 'success');
        return;
      }

      if (!activeSector) {
        return;
      }

      const updated = await adminApi.updateSector(activeSector.id, payload);
      setSectors((current) => {
        const next = current.map((item) => (item.id === activeSector.id ? updated : item));
        return [...next].sort((a, b) => a.order - b.order);
      });
      setDrafts((current) => ({
        ...current,
        [activeSector.id]: buildDraft(updated),
      }));
      showToast(`Secteur « ${updated.name} » enregistré.`, 'success');
    } catch (error) {
      const message = formatAdminError(error);
      setErrors((current) => ({
        ...current,
        [editorId]: message,
      }));
      showToast(message, 'error');
    } finally {
      setSavingId(null);
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) {
      return;
    }

    setIsDeleting(true);

    try {
      await adminApi.deleteSector(pendingDelete.id);
      setPendingDelete(null);
      showToast(`Secteur « ${pendingDelete.name} » supprimé.`, 'success');

      const remaining = sectors.filter((s) => s.id !== pendingDelete.id);
      setSectors(remaining);
      setDrafts((current) => {
        const next = { ...current };
        delete next[pendingDelete.id];
        return next;
      });

      if (activeId === pendingDelete.id) {
        setActiveId(remaining[0]?.id ?? CREATE_ID);
        if (remaining.length === 0) {
          setDrafts({ [CREATE_ID]: emptyDraft(0) });
        }
      }
    } catch (error) {
      showToast(formatAdminError(error), 'error');
      setPendingDelete(null);
    } finally {
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return (
      <AdminAuthGate>
        <AdminShell>
          <AdminPageHeader
            label="Secteurs"
            title="Domaines d'activité"
            lead="Créez et gérez les secteurs affichés sur le site."
          />
          <p className="admin-loading-text">Chargement des secteurs…</p>
        </AdminShell>
      </AdminAuthGate>
    );
  }

  const dirty = isDraftDirty(activeSector, activeDraft);

  return (
    <AdminAuthGate>
      <AdminShell>
        <AdminPageHeader
          label="Secteurs"
          title="Domaines d'activité"
          lead="Ajoutez, modifiez ou supprimez des secteurs. Ils apparaissent automatiquement sur le site."
          actions={
            <button type="button" className="admin-btn admin-btn--primary admin-btn--sm" onClick={startCreate}>
              <Plus className="h-4 w-4" aria-hidden />
              Nouveau secteur
            </button>
          }
        />

        {globalError ? (
          <div role="alert" className="admin-alert">
            {globalError}
          </div>
        ) : null}

        <div className="admin-sectors">
          <nav className="admin-sectors__nav" aria-label="Liste des secteurs">
            {sortedSectors.map((sector) => {
              const sectorDirty = isDraftDirty(sector, drafts[sector.id]);
              const isActive = !isCreating && sector.id === activeSector?.id;

              return (
                <button
                  key={sector.id}
                  type="button"
                  className={cn(
                    'admin-sectors__nav-item',
                    isActive && 'admin-sectors__nav-item--active',
                    sectorDirty && 'admin-sectors__nav-item--dirty',
                  )}
                  aria-current={isActive ? 'true' : undefined}
                  onClick={() => selectSector(sector.id)}
                >
                  <span className="admin-sectors__nav-order">Ordre {sector.order}</span>
                  <span className="admin-sectors__nav-name">{sector.name}</span>
                  {sectorDirty ? <span className="admin-sectors__nav-dirty">Modifié</span> : null}
                </button>
              );
            })}

            {isCreating ? (
              <button
                type="button"
                className="admin-sectors__nav-item admin-sectors__nav-item--active"
                aria-current="true"
              >
                <span className="admin-sectors__nav-order">Nouveau</span>
                <span className="admin-sectors__nav-name">
                  {activeDraft?.name.trim() || 'Nouveau secteur'}
                </span>
              </button>
            ) : null}

            <button type="button" className="admin-btn admin-btn--ghost admin-btn--sm" onClick={startCreate}>
              <Plus className="h-4 w-4" aria-hidden />
              Ajouter
            </button>
          </nav>

          <section className="admin-sectors__editor" aria-labelledby="sector-editor-title">
            <header className="admin-sectors__editor-head">
              <div>
                <h2 id="sector-editor-title" className="admin-sectors__editor-title">
                  {isCreating ? 'Nouveau secteur' : activeSector?.name}
                </h2>
                {!isCreating && activeSector ? (
                  <p className="admin-sectors__editor-slug">
                    Identifiant : <code>{activeSector.slug}</code>
                  </p>
                ) : (
                  <p className="admin-sectors__editor-slug">
                    Le secteur sera visible sur <code>/secteurs</code> et dans les filtres projets.
                  </p>
                )}
              </div>
              {!isCreating && activeSector ? (
                <a
                  href={`/secteurs/${activeSector.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="admin-btn admin-btn--ghost admin-btn--sm"
                >
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  Voir sur le site
                </a>
              ) : null}
            </header>

            <div className="admin-sectors__editor-body">
              <div className="admin-form-grid admin-form-grid--2" style={{ marginBottom: '1.25rem' }}>
                <div>
                  <label htmlFor="sector-name" className="admin-field__label admin-field__label--required">
                    Nom du secteur
                  </label>
                  <input
                    id="sector-name"
                    className="admin-field__input"
                    value={activeDraft?.name ?? ''}
                    onChange={(event) => updateDraft(editorId, { name: event.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="sector-slug" className="admin-field__label admin-field__label--required">
                    Identifiant web (slug)
                  </label>
                  <input
                    id="sector-slug"
                    className="admin-field__input"
                    value={activeDraft?.slug ?? ''}
                    onChange={(event) => {
                      setSlugTouched((current) => ({ ...current, [editorId]: true }));
                      updateDraft(editorId, { slug: event.target.value });
                    }}
                  />
                  <p className="admin-field__hint">Ex. : <code>energie-renouvelable</code></p>
                </div>
              </div>

              <div className="admin-sectors__grid">
                <div className="admin-sectors__media">
                  {accessToken ? (
                    <ImageUploadField
                      label="Image du secteur"
                      value={activeDraft?.imageUrl ?? ''}
                      accessToken={accessToken}
                      onChange={(url) => updateDraft(editorId, { imageUrl: url })}
                    />
                  ) : null}
                </div>

                <div className="admin-sectors__fields">
                  <div>
                    <label
                      htmlFor="sector-description"
                      className="admin-field__label admin-field__label--required"
                    >
                      Description
                    </label>
                    <textarea
                      id="sector-description"
                      rows={6}
                      className="admin-field__textarea"
                      value={activeDraft?.description ?? ''}
                      onChange={(event) =>
                        updateDraft(editorId, { description: event.target.value })
                      }
                    />
                  </div>

                  <div className="admin-sectors__order">
                    <label htmlFor="sector-order" className="admin-field__label admin-field__label--required">
                      Ordre d&apos;affichage
                    </label>
                    <input
                      id="sector-order"
                      type="number"
                      min={0}
                      className="admin-field__input"
                      value={activeDraft?.order ?? '0'}
                      onChange={(event) => updateDraft(editorId, { order: event.target.value })}
                    />
                  </div>

                  {errors[editorId] ? (
                    <p className="admin-field__error" role="alert">
                      {errors[editorId]}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>

            <footer className="admin-sectors__editor-foot">
              <div className="admin-form-actions__end" style={{ marginLeft: 0, width: '100%', justifyContent: 'space-between' }}>
                {!isCreating && activeSector ? (
                  <button
                    type="button"
                    className="admin-btn admin-btn--danger admin-btn--sm"
                    onClick={() => setPendingDelete(activeSector)}
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden />
                    Supprimer
                  </button>
                ) : (
                  <span />
                )}
                <div className="admin-form-actions__end">
                  <p
                    className={cn(
                      'admin-sectors__editor-hint',
                      dirty && 'admin-sectors__editor-hint--dirty',
                    )}
                  >
                    {dirty ? 'Modifications non enregistrées' : 'Enregistré'}
                  </p>
                  <button
                    type="button"
                    className="admin-btn admin-btn--primary"
                    disabled={savingId === editorId || (!isCreating && !dirty)}
                    onClick={() => void saveSector()}
                  >
                    {savingId === editorId
                      ? 'Enregistrement…'
                      : isCreating
                        ? 'Créer le secteur'
                        : 'Enregistrer'}
                  </button>
                </div>
              </div>
            </footer>
          </section>
        </div>

        <ConfirmModal
          open={Boolean(pendingDelete)}
          title="Supprimer ce secteur ?"
          message={
            pendingDelete
              ? `Le secteur « ${pendingDelete.name} » sera retiré du site. Impossible s’il contient encore des projets.`
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
