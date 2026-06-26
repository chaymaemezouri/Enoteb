'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ExternalLink } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { adminApi } from '@/lib/admin-api';
import { formatAdminError, slugify } from '@/lib/admin-utils';
import { ApiClientError } from '@/lib/api';
import { revalidatePublicProject } from '@/lib/revalidate-public';
import type { AdminProjectDetail } from '@/types/admin';
import type { Sector } from '@/types';
import { AdminPageHeader, ConfirmModal, useAdminToast } from '@/components/admin';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { GalleryPhotosField, type GalleryPhotoDraft } from '@/components/admin/GalleryPhotosField';

interface ProjectFormProps {
  mode: 'create' | 'edit';
  projectId?: string;
}

interface FormState {
  name: string;
  slug: string;
  sectorId: string;
  client: string;
  location: string;
  address: string;
  amount: string;
  showAmount: boolean;
  year: string;
  description: string;
  mainImageUrl: string;
  isPublished: boolean;
}

interface FormErrors {
  name?: string;
  slug?: string;
  sectorId?: string;
  location?: string;
  amount?: string;
  year?: string;
  description?: string;
  mainImageUrl?: string;
  form?: string;
  photos?: Record<number, { altText?: string; order?: string }>;
}

const currentYear = new Date().getFullYear();

function buildInitialForm(project?: AdminProjectDetail): FormState {
  return {
    name: project?.name ?? '',
    slug: project?.slug ?? '',
    sectorId: project?.sectorId ?? '',
    client: project?.client ?? '',
    location: project?.location ?? '',
    address: project?.address ?? '',
    amount: project?.amount ?? '',
    showAmount: project?.showAmount ?? false,
    year: project?.year ? String(project.year) : '',
    description: project?.description ?? '',
    mainImageUrl: project?.mainImageUrl ?? '',
    isPublished: project?.isPublished ?? false,
  };
}

function buildInitialPhotos(project?: AdminProjectDetail): GalleryPhotoDraft[] {
  return (
    project?.photos.map((photo) => ({
      id: photo.id,
      url: photo.url,
      altText: photo.altText,
      order: photo.order,
    })) ?? []
  );
}

function serializeFormState(form: FormState, photos: GalleryPhotoDraft[]): string {
  return JSON.stringify({ form, photos });
}

export function ProjectForm({ mode, projectId }: ProjectFormProps) {
  const router = useRouter();
  const { accessToken } = useAuth();
  const { showToast } = useAdminToast();
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [form, setForm] = useState<FormState>(() => buildInitialForm());
  const [photos, setPhotos] = useState<GalleryPhotoDraft[]>([]);
  const [removedPhotoIds, setRemovedPhotoIds] = useState<string[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(mode === 'edit');
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [slugTouched, setSlugTouched] = useState(mode === 'edit');
  const savedSnapshot = useRef('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const sectorList = await adminApi.getSectors();
        if (cancelled) {
          return;
        }

        setSectors(sectorList);

        if (mode === 'edit' && projectId) {
          const project = await adminApi.getProject(projectId);
          if (cancelled) {
            return;
          }

          const initialForm = buildInitialForm(project);
          const initialPhotos = buildInitialPhotos(project);
          setForm(initialForm);
          setPhotos(initialPhotos);
          savedSnapshot.current = serializeFormState(initialForm, initialPhotos);
        } else {
          savedSnapshot.current = serializeFormState(buildInitialForm(), []);
        }
      } catch (error) {
        if (!cancelled) {
          setErrors({ form: formatAdminError(error) });
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
  }, [mode, projectId]);

  const isDirty = useMemo(
    () => serializeFormState(form, photos) !== savedSnapshot.current,
    [form, photos],
  );

  useEffect(() => {
    if (!isDirty) {
      return;
    }

    function handleBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = '';
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const pageTitle = mode === 'create' ? 'Ajouter un projet' : 'Modifier le projet';

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => {
      const next = { ...current, [key]: value };

      if (key === 'name' && !slugTouched) {
        next.slug = slugify(String(value));
      }

      return next;
    });
  }

  function validate(): FormErrors {
    const nextErrors: FormErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = 'Indiquez le nom du projet.';
    }

    if (!form.slug.trim()) {
      nextErrors.slug = 'Indiquez l\u2019identifiant web du projet.';
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug)) {
      nextErrors.slug = 'Utilisez uniquement des lettres minuscules, chiffres et tirets.';
    }

    if (!form.sectorId) {
      nextErrors.sectorId = 'Choisissez un secteur.';
    }

    if (!form.location.trim()) {
      nextErrors.location = 'Indiquez la localisation du projet.';
    }

    if (form.amount.trim()) {
      const amountValue = Number(form.amount.replace(',', '.'));
      if (Number.isNaN(amountValue) || amountValue <= 0) {
        nextErrors.amount = 'Le montant doit être un nombre positif.';
      }
    }

    if (form.year.trim()) {
      const yearValue = Number(form.year);
      if (Number.isNaN(yearValue) || yearValue < 1900 || yearValue > currentYear + 1) {
        nextErrors.year = `L\u2019année doit être comprise entre 1900 et ${currentYear + 1}.`;
      }
    }

    if (!form.description.trim()) {
      nextErrors.description = 'Rédigez une description du projet.';
    }

    if (!form.mainImageUrl.trim()) {
      nextErrors.mainImageUrl = 'Ajoutez une image principale.';
    }

    const photoErrors: FormErrors['photos'] = {};
    photos.forEach((photo, index) => {
      const itemErrors: { altText?: string; order?: string } = {};

      if (!photo.altText.trim()) {
        itemErrors.altText = 'Décrivez brièvement cette photo.';
      }

      if (Number.isNaN(photo.order) || photo.order < 0) {
        itemErrors.order = 'L\u2019ordre doit être un nombre positif ou zéro.';
      }

      if (itemErrors.altText || itemErrors.order) {
        photoErrors[index] = itemErrors;
      }
    });

    if (Object.keys(photoErrors).length > 0) {
      nextErrors.photos = photoErrors;
    }

    return nextErrors;
  }

  async function syncPhotos(projectIdValue: string): Promise<GalleryPhotoDraft[]> {
    for (const photoId of removedPhotoIds) {
      try {
        await adminApi.deletePhoto(projectIdValue, photoId);
      } catch (error) {
        if (!(error instanceof ApiClientError && error.statusCode === 404)) {
          throw error;
        }
      }
    }

    const syncedPhotos: GalleryPhotoDraft[] = [];

    for (const photo of photos) {
      if (photo.id) {
        await adminApi.updatePhoto(projectIdValue, photo.id, {
          altText: photo.altText.trim(),
          order: photo.order,
        });
        syncedPhotos.push({ ...photo, isNew: false });
        continue;
      }

      const created = await adminApi.addPhoto(projectIdValue, {
        url: photo.url,
        altText: photo.altText.trim(),
        order: photo.order,
      });

      syncedPhotos.push({
        id: created.id,
        url: created.url,
        altText: created.altText,
        order: created.order,
        isNew: false,
      });
    }

    return syncedPhotos;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      showToast('Corrigez les erreurs du formulaire.', 'error');
      return;
    }

    if (!accessToken) {
      setErrors({ form: 'Votre session a expiré. Reconnectez-vous.' });
      return;
    }

    setIsSaving(true);
    setErrors({});

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      sectorId: form.sectorId,
      client: form.client.trim() || undefined,
      location: form.location.trim(),
      address: form.address.trim() ? form.address.trim() : null,
      description: form.description.trim(),
      mainImageUrl: form.mainImageUrl.trim(),
      showAmount: form.showAmount,
      isPublished: form.isPublished,
      ...(form.amount.trim() ? { amount: Number(form.amount.replace(',', '.')) } : {}),
      ...(form.year.trim() ? { year: Number(form.year) } : {}),
    };

    try {
      if (mode === 'create') {
        const created = await adminApi.createProject(payload);
        const syncedPhotos = await syncPhotos(created.id);
        setPhotos(syncedPhotos);
        setRemovedPhotoIds([]);
        savedSnapshot.current = serializeFormState(form, syncedPhotos);
        await revalidatePublicProject(created.slug);
        showToast('Projet créé avec succès.', 'success');
        router.push('/admin/projects');
        router.refresh();
        return;
      }

      if (!projectId) {
        throw new Error('Projet introuvable.');
      }

      await adminApi.updateProject(projectId, payload);
      const syncedPhotos = await syncPhotos(projectId);
      setPhotos(syncedPhotos);
      setRemovedPhotoIds([]);
      savedSnapshot.current = serializeFormState(form, syncedPhotos);
      await revalidatePublicProject(form.slug.trim());
      showToast('Projet enregistré.', 'success');
      router.push('/admin/projects');
      router.refresh();
    } catch (error) {
      const message = formatAdminError(error);
      setErrors({ form: message });
      showToast(message, 'error');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!projectId) {
      return;
    }

    setIsDeleting(true);

    try {
      await adminApi.deleteProject(projectId);
      showToast('Projet supprimé.', 'success');
      router.push('/admin/projects');
      router.refresh();
    } catch (error) {
      const message = formatAdminError(error);
      setErrors({ form: message });
      showToast(message, 'error');
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  }

  function handlePhotoChange(nextPhotos: GalleryPhotoDraft[]) {
    const removed = photos
      .filter((photo) => photo.id)
      .filter((photo) => !nextPhotos.some((item) => item.id === photo.id))
      .map((photo) => photo.id as string);

    if (removed.length > 0) {
      setRemovedPhotoIds((current) => Array.from(new Set([...current, ...removed])));
    }

    setPhotos(nextPhotos);
  }

  function handleCancel() {
    if (isDirty && !window.confirm('Des modifications non enregistrées seront perdues. Continuer ?')) {
      return;
    }

    router.push('/admin/projects');
  }

  if (isLoading) {
    return (
      <div className="admin-form-panel">
        <p className="admin-loading-text" style={{ padding: '2rem' }}>
          Chargement du projet…
        </p>
      </div>
    );
  }

  if (!accessToken) {
    return null;
  }

  return (
    <>
      <AdminPageHeader
        label={mode === 'create' ? 'Nouveau' : 'Édition'}
        title={pageTitle}
        lead="Les champs marqués d'un astérisque sont obligatoires."
        actions={
          mode === 'edit' && form.isPublished && form.slug ? (
            <a
              href={`/projets/${form.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="admin-btn admin-btn--ghost"
            >
              <ExternalLink className="h-4 w-4" aria-hidden />
              Voir sur le site
            </a>
          ) : undefined
        }
      />

      {isDirty ? (
        <p className="admin-field__hint" style={{ marginBottom: '1rem', color: 'var(--admin-orange)' }}>
          Modifications non enregistrées
        </p>
      ) : null}

      <form onSubmit={(event) => void handleSubmit(event)} className="admin-form">
        {errors.form ? (
          <div role="alert" className="admin-alert">
            {errors.form}
          </div>
        ) : null}

        <section className="admin-form-panel">
          <div className="admin-form-panel__head">
            <h2 className="admin-form-panel__title">Informations générales</h2>
            <p className="admin-form-panel__lead">Nom, secteur et localisation du projet.</p>
          </div>
          <div className="admin-form-panel__body admin-form-grid admin-form-grid--2">
            <div>
              <label htmlFor="project-name" className="admin-field__label admin-field__label--required">
                Nom du projet
              </label>
              <input
                id="project-name"
                className="admin-field__input"
                value={form.name}
                onChange={(event) => updateField('name', event.target.value)}
              />
              {errors.name ? <p className="admin-field__error">{errors.name}</p> : null}
            </div>

            <div>
              <label htmlFor="project-slug" className="admin-field__label admin-field__label--required">
                Identifiant web (URL)
              </label>
              <input
                id="project-slug"
                className="admin-field__input"
                value={form.slug}
                onChange={(event) => {
                  setSlugTouched(true);
                  updateField('slug', event.target.value);
                }}
              />
              {errors.slug ? <p className="admin-field__error">{errors.slug}</p> : null}
            </div>

            <div>
              <label htmlFor="project-sector" className="admin-field__label admin-field__label--required">
                Secteur
              </label>
              <select
                id="project-sector"
                className="admin-field__select"
                value={form.sectorId}
                onChange={(event) => updateField('sectorId', event.target.value)}
              >
                <option value="">Choisir un secteur</option>
                {sectors.map((sector) => (
                  <option key={sector.id} value={sector.id}>
                    {sector.name}
                  </option>
                ))}
              </select>
              {errors.sectorId ? <p className="admin-field__error">{errors.sectorId}</p> : null}
            </div>

            <div>
              <label htmlFor="project-client" className="admin-field__label">
                Client / Maître d&apos;ouvrage
              </label>
              <input
                id="project-client"
                className="admin-field__input"
                value={form.client}
                onChange={(event) => updateField('client', event.target.value)}
              />
            </div>

            <div>
              <label htmlFor="project-location" className="admin-field__label admin-field__label--required">
                Localisation
              </label>
              <input
                id="project-location"
                className="admin-field__input"
                value={form.location}
                onChange={(event) => updateField('location', event.target.value)}
                placeholder="Ville ou région"
              />
              {errors.location ? <p className="admin-field__error">{errors.location}</p> : null}
            </div>

            <div>
              <label htmlFor="project-address" className="admin-field__label">
                Adresse 
              </label>
              <input
                id="project-address"
                className="admin-field__input"
                value={form.address}
                onChange={(event) => updateField('address', event.target.value)}
                placeholder="N°, rue, code postal…"
              />
            </div>

            <div>
              <label htmlFor="project-year" className="admin-field__label">
                Année
              </label>
              <input
                id="project-year"
                type="number"
                min={1900}
                max={currentYear + 1}
                className="admin-field__input"
                value={form.year}
                onChange={(event) => updateField('year', event.target.value)}
              />
              {errors.year ? <p className="admin-field__error">{errors.year}</p> : null}
            </div>

            <div>
              <label htmlFor="project-amount" className="admin-field__label">
                Montant (MAD)
              </label>
              <input
                id="project-amount"
                inputMode="decimal"
                className="admin-field__input"
                value={form.amount}
                onChange={(event) => updateField('amount', event.target.value)}
              />
              {errors.amount ? <p className="admin-field__error">{errors.amount}</p> : null}
              <label className="admin-checkbox-row" style={{ marginTop: '0.75rem' }}>
                <input
                  type="checkbox"
                  checked={form.showAmount}
                  onChange={(event) => updateField('showAmount', event.target.checked)}
                />
                Afficher le montant sur le site public
              </label>
            </div>
          </div>
        </section>

        <section className="admin-form-panel">
          <div className="admin-form-panel__head">
            <h2 className="admin-form-panel__title">Description</h2>
          </div>
          <div className="admin-form-panel__body">
            <label htmlFor="project-description" className="admin-field__label admin-field__label--required">
              Contenu
            </label>
            <textarea
              id="project-description"
              className="admin-field__textarea"
              value={form.description}
              onChange={(event) => updateField('description', event.target.value)}
              rows={8}
            />
            {errors.description ? <p className="admin-field__error">{errors.description}</p> : null}
          </div>
        </section>

        <section className="admin-form-panel">
          <div className="admin-form-panel__head">
            <h2 className="admin-form-panel__title">Médias</h2>
            <p className="admin-form-panel__lead">Image principale et galerie photos.</p>
          </div>
          <div className="admin-form-panel__body">
            <div className="admin-media-layout">
              <div className="admin-media-layout__main">
                <ImageUploadField
                  label="Image principale"
                  required
                  value={form.mainImageUrl}
                  accessToken={accessToken}
                  onChange={(url) => updateField('mainImageUrl', url)}
                  error={errors.mainImageUrl}
                />
              </div>

              <div className="admin-media-layout__gallery">
                <GalleryPhotosField
                  photos={photos}
                  accessToken={accessToken}
                  onChange={handlePhotoChange}
                  errors={errors.photos}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="admin-form-panel">
          <div className="admin-form-panel__head">
            <h2 className="admin-form-panel__title">Publication</h2>
          </div>
          <div className="admin-form-panel__body">
            <label className="admin-checkbox-row">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(event) => updateField('isPublished', event.target.checked)}
              />
              Publier ce projet sur le site (visible par les visiteurs)
            </label>
          </div>
        </section>

        <div className="admin-form-actions">
          {mode === 'edit' ? (
            <button
              type="button"
              className="admin-btn admin-btn--danger"
              onClick={() => setShowDeleteModal(true)}
            >
              Supprimer ce projet
            </button>
          ) : (
            <div />
          )}

          <div className="admin-form-actions__end">
            <button type="button" className="admin-btn admin-btn--secondary" onClick={handleCancel}>
              Annuler
            </button>
            <button type="submit" className="admin-btn admin-btn--primary" disabled={isSaving}>
              {isSaving ? 'Enregistrement…' : 'Enregistrer le projet'}
            </button>
          </div>
        </div>
      </form>

      <ConfirmModal
        open={showDeleteModal}
        title="Supprimer ce projet ?"
        message="Cette action est définitive. Le projet et ses photos seront retirés du site."
        confirmLabel="Oui, supprimer"
        isLoading={isDeleting}
        onConfirm={() => void handleDelete()}
        onCancel={() => setShowDeleteModal(false)}
      />
    </>
  );
}
