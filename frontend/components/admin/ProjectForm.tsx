'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { adminApi } from '@/lib/admin-api';
import { formatAdminError, slugify } from '@/lib/admin-utils';
import type { AdminProjectDetail } from '@/types/admin';
import type { Sector } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { GalleryPhotosField, type GalleryPhotoDraft } from '@/components/admin/GalleryPhotosField';
import { ConfirmModal } from '@/components/admin/ConfirmModal';

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

export function ProjectForm({ mode, projectId }: ProjectFormProps) {
  const router = useRouter();
  const { accessToken } = useAuth();
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

          setForm(buildInitialForm(project));
          setPhotos(buildInitialPhotos(project));
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

  const pageTitle = useMemo(
    () => (mode === 'create' ? 'Ajouter un projet' : 'Modifier le projet'),
    [mode],
  );

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
      nextErrors.slug = 'Indiquez l’identifiant web du projet.';
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
        nextErrors.year = `L’année doit être comprise entre 1900 et ${currentYear + 1}.`;
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
        itemErrors.order = 'L’ordre doit être un nombre positif ou zéro.';
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

  async function syncPhotos(projectIdValue: string) {
    for (const photoId of removedPhotoIds) {
      await adminApi.deletePhoto(projectIdValue, photoId);
    }

    for (const photo of photos) {
      if (photo.id && !photo.isNew) {
        await adminApi.updatePhoto(projectIdValue, photo.id, {
          altText: photo.altText.trim(),
          order: photo.order,
        });
      } else {
        await adminApi.addPhoto(projectIdValue, {
          url: photo.url,
          altText: photo.altText.trim(),
          order: photo.order,
        });
      }
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
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
        await syncPhotos(created.id);
        router.push('/admin/projects');
        router.refresh();
        return;
      }

      if (!projectId) {
        throw new Error('Projet introuvable.');
      }

      await adminApi.updateProject(projectId, payload);
      await syncPhotos(projectId);
      router.push('/admin/projects');
      router.refresh();
    } catch (error) {
      setErrors({ form: formatAdminError(error) });
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
      router.push('/admin/projects');
      router.refresh();
    } catch (error) {
      setErrors({ form: formatAdminError(error) });
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

  if (isLoading) {
    return (
      <div className="rounded-card border border-neutral-200 bg-white p-8">
        <p className="text-body text-neutral-700">Chargement du projet…</p>
      </div>
    );
  }

  if (!accessToken) {
    return null;
  }

  return (
    <>
      <div className="mb-6">
        <h2 className="text-title text-neutral-900">{pageTitle}</h2>
        <p className="mt-1 text-body text-neutral-600">
          Remplissez les informations ci-dessous. Les champs marqués d’un astérisque sont
          obligatoires.
        </p>
      </div>

      <form
        onSubmit={(event) => void handleSubmit(event)}
        className="space-y-8 rounded-card border border-neutral-200 bg-white p-6"
      >
        {errors.form ? (
          <div
            role="alert"
            className="rounded-button border border-red-200 bg-red-50 px-4 py-3 text-body text-red-700"
          >
            {errors.form}
          </div>
        ) : null}

        <section className="grid gap-5 md:grid-cols-2">
          <div>
            <Label htmlFor="project-name" required>
              Nom du projet
            </Label>
            <Input
              id="project-name"
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
              error={errors.name}
            />
          </div>

          <div>
            <Label htmlFor="project-slug" required>
              Identifiant web (URL)
            </Label>
            <Input
              id="project-slug"
              value={form.slug}
              onChange={(event) => {
                setSlugTouched(true);
                updateField('slug', event.target.value);
              }}
              error={errors.slug}
            />
          </div>

          <div>
            <Label htmlFor="project-sector" required>
              Secteur
            </Label>
            <select
              id="project-sector"
              value={form.sectorId}
              onChange={(event) => updateField('sectorId', event.target.value)}
              className="flex h-11 w-full rounded-button border border-border bg-background px-3 text-body text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
            >
              <option value="">Choisir un secteur</option>
              {sectors.map((sector) => (
                <option key={sector.id} value={sector.id}>
                  {sector.name}
                </option>
              ))}
            </select>
            {errors.sectorId ? (
              <p className="mt-1.5 text-body-sm text-red-600">{errors.sectorId}</p>
            ) : null}
          </div>

          <div>
            <Label htmlFor="project-client">Client / Maître d’ouvrage</Label>
            <Input
              id="project-client"
              value={form.client}
              onChange={(event) => updateField('client', event.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="project-location" required>
              Localisation
            </Label>
            <Input
              id="project-location"
              value={form.location}
              onChange={(event) => updateField('location', event.target.value)}
              error={errors.location}
            />
          </div>

          <div>
            <Label htmlFor="project-year">Année</Label>
            <Input
              id="project-year"
              type="number"
              min={1900}
              max={currentYear + 1}
              value={form.year}
              onChange={(event) => updateField('year', event.target.value)}
              error={errors.year}
            />
          </div>

          <div>
            <Label htmlFor="project-amount">Montant (MAD)</Label>
            <Input
              id="project-amount"
              inputMode="decimal"
              value={form.amount}
              onChange={(event) => updateField('amount', event.target.value)}
              error={errors.amount}
            />
            <label className="mt-3 flex items-center gap-3 text-body text-neutral-800">
              <input
                type="checkbox"
                checked={form.showAmount}
                onChange={(event) => updateField('showAmount', event.target.checked)}
                className="h-5 w-5 rounded border-neutral-300"
              />
              Afficher le montant sur le site public
            </label>
          </div>
        </section>

        <section>
          <Label htmlFor="project-description" required>
            Description
          </Label>
          <Textarea
            id="project-description"
            value={form.description}
            onChange={(event) => updateField('description', event.target.value)}
            error={errors.description}
            rows={8}
          />
        </section>

        <section>
          <ImageUploadField
            label="Image principale"
            required
            value={form.mainImageUrl}
            accessToken={accessToken}
            onChange={(url) => updateField('mainImageUrl', url)}
            error={errors.mainImageUrl}
          />
        </section>

        <section>
          <GalleryPhotosField
            photos={photos}
            accessToken={accessToken}
            onChange={handlePhotoChange}
            errors={errors.photos}
          />
        </section>

        <section>
          <label className="flex items-center gap-3 rounded-button border border-neutral-200 bg-neutral-50 px-4 py-4 text-body text-neutral-800">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(event) => updateField('isPublished', event.target.checked)}
              className="h-5 w-5 rounded border-neutral-300"
            />
            Publier ce projet sur le site (visible par les visiteurs)
          </label>
        </section>

        <div className="flex flex-col gap-3 border-t border-neutral-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          {mode === 'edit' ? (
            <Button
              type="button"
              variant="danger"
              size="lg"
              onClick={() => setShowDeleteModal(true)}
            >
              Supprimer ce projet
            </Button>
          ) : (
            <div />
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => router.push('/admin/projects')}
            >
              Annuler
            </Button>
            <Button type="submit" size="lg" disabled={isSaving}>
              {isSaving ? 'Enregistrement…' : 'Enregistrer le projet'}
            </Button>
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
