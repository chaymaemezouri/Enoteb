'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { AdminAuthGate, AdminShell, ImageUploadField } from '@/components/admin';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { useAuth } from '@/contexts/AuthContext';
import { adminApi } from '@/lib/admin-api';
import { formatAdminError } from '@/lib/admin-utils';
import { getApiUrl } from '@/lib/api';
import type { Sector } from '@/types';

function resolveImageSrc(url: string | null): string | null {
  if (!url) {
    return null;
  }

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  return `${getApiUrl()}${url}`;
}

export default function AdminSectorsPage() {
  const { accessToken } = useAuth();
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [drafts, setDrafts] = useState<
    Record<string, { description: string; imageUrl: string; order: string }>
  >({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const list = await adminApi.getSectors();
        if (cancelled) {
          return;
        }

        setSectors(list);
        setDrafts(
          Object.fromEntries(
            list.map((sector) => [
              sector.id,
              {
                description: sector.description,
                imageUrl: sector.imageUrl ?? '',
                order: String(sector.order),
              },
            ]),
          ),
        );
      } catch (error) {
        if (!cancelled) {
          setGlobalError(formatAdminError(error));
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

  function updateDraft(
    sectorId: string,
    patch: Partial<{ description: string; imageUrl: string; order: string }>,
  ) {
    setDrafts((current) => ({
      ...current,
      [sectorId]: { ...current[sectorId], ...patch },
    }));
    setSavedId(null);
  }

  async function saveSector(sector: Sector) {
    const draft = drafts[sector.id];

    if (!draft.description.trim()) {
      setErrors((current) => ({
        ...current,
        [sector.id]: 'La description est obligatoire.',
      }));
      return;
    }

    const orderValue = Number(draft.order);
    if (Number.isNaN(orderValue) || orderValue < 0) {
      setErrors((current) => ({
        ...current,
        [sector.id]: 'L’ordre doit être un nombre positif ou zéro.',
      }));
      return;
    }

    setSavingId(sector.id);
    setErrors((current) => ({ ...current, [sector.id]: '' }));
    setGlobalError(null);

    try {
      const updated = await adminApi.updateSector(sector.id, {
        description: draft.description.trim(),
        imageUrl: draft.imageUrl.trim() || undefined,
        order: orderValue,
      });

      setSectors((current) => current.map((item) => (item.id === sector.id ? updated : item)));
      setSavedId(sector.id);
    } catch (error) {
      setErrors((current) => ({
        ...current,
        [sector.id]: formatAdminError(error),
      }));
    } finally {
      setSavingId(null);
    }
  }

  return (
    <AdminAuthGate>
      <AdminShell>
        <div className="space-y-6">
          <div>
            <h2 className="text-title text-neutral-900">Secteurs</h2>
            <p className="mt-1 text-body text-neutral-600">
              Les cinq secteurs ENOTEB sont fixes. Vous pouvez modifier leur description, leur image
              et leur ordre d’affichage.
            </p>
          </div>

          {globalError ? (
            <div
              role="alert"
              className="rounded-button border border-red-200 bg-red-50 px-4 py-3 text-body text-red-700"
            >
              {globalError}
            </div>
          ) : null}

          {isLoading ? (
            <p className="text-body text-neutral-700">Chargement des secteurs…</p>
          ) : (
            <div className="space-y-6">
              {sectors.map((sector) => {
                const draft = drafts[sector.id];
                const preview = resolveImageSrc(draft?.imageUrl || sector.imageUrl);

                return (
                  <section
                    key={sector.id}
                    className="rounded-card border border-neutral-200 bg-white p-6"
                  >
                    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-subtitle font-semibold text-neutral-900">
                          {sector.name}
                        </h3>
                        <p className="text-body-sm text-neutral-500">Identifiant : {sector.slug}</p>
                      </div>
                      {savedId === sector.id ? (
                        <p className="text-body-sm font-medium text-green-700">
                          Modifications enregistrées
                        </p>
                      ) : null}
                    </div>

                    {preview ? (
                      <div className="relative mb-5 aspect-[21/9] w-full max-w-xl overflow-hidden rounded-button bg-neutral-100">
                        <Image
                          src={preview}
                          alt={sector.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : null}

                    <div className="space-y-5">
                      <div>
                        <Label htmlFor={`sector-description-${sector.id}`} required>
                          Description
                        </Label>
                        <Textarea
                          id={`sector-description-${sector.id}`}
                          rows={5}
                          value={draft?.description ?? ''}
                          onChange={(event) =>
                            updateDraft(sector.id, {
                              description: event.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="max-w-xs">
                        <Label htmlFor={`sector-order-${sector.id}`} required>
                          Ordre d’affichage
                        </Label>
                        <Input
                          id={`sector-order-${sector.id}`}
                          type="number"
                          min={0}
                          value={draft?.order ?? '0'}
                          onChange={(event) =>
                            updateDraft(sector.id, { order: event.target.value })
                          }
                        />
                      </div>

                      {accessToken ? (
                        <ImageUploadField
                          label="Image du secteur"
                          value={draft?.imageUrl ?? ''}
                          accessToken={accessToken}
                          onChange={(url) => updateDraft(sector.id, { imageUrl: url })}
                        />
                      ) : null}

                      {errors[sector.id] ? (
                        <p className="text-body-sm text-red-600">{errors[sector.id]}</p>
                      ) : null}

                      <Button
                        type="button"
                        size="lg"
                        disabled={savingId === sector.id}
                        onClick={() => void saveSector(sector)}
                      >
                        {savingId === sector.id ? 'Enregistrement…' : 'Enregistrer ce secteur'}
                      </Button>
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </AdminShell>
    </AdminAuthGate>
  );
}
