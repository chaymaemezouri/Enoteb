'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { uploadImage } from '@/lib/admin-utils';
import { getApiUrl } from '@/lib/api';

export interface GalleryPhotoDraft {
  id?: string;
  url: string;
  altText: string;
  order: number;
  isNew?: boolean;
}

interface GalleryPhotosFieldProps {
  photos: GalleryPhotoDraft[];
  accessToken: string;
  onChange: (photos: GalleryPhotoDraft[]) => void;
  errors?: Record<number, { altText?: string; order?: string }>;
}

function resolveImageSrc(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  return `${getApiUrl()}${url}`;
}

export function GalleryPhotosField({
  photos,
  accessToken,
  onChange,
  errors = {},
}: GalleryPhotosFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) {
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const nextPhotos = [...photos];
      let orderBase = nextPhotos.length;

      for (const file of Array.from(files)) {
        const url = await uploadImage(file, accessToken);
        nextPhotos.push({
          url,
          altText: '',
          order: orderBase,
          isNew: true,
        });
        orderBase += 1;
      }

      onChange(nextPhotos);
    } catch {
      setUploadError(
        'Certaines images n’ont pas pu être envoyées. Réessayez avec des fichiers JPG ou PNG (5 Mo max).',
      );
    } finally {
      setIsUploading(false);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  }

  function updatePhoto(index: number, patch: Partial<GalleryPhotoDraft>) {
    const next = photos.map((photo, photoIndex) =>
      photoIndex === index ? { ...photo, ...patch } : photo,
    );
    onChange(next);
  }

  function removePhoto(index: number) {
    onChange(photos.filter((_, photoIndex) => photoIndex !== index));
  }

  const sorted = [...photos].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-4">
      <div>
        <Label>Photos de la galerie</Label>
        <p className="mb-3 text-body-sm text-neutral-600">
          Ajoutez une ou plusieurs images. Chaque photo doit avoir une description courte (texte
          alternatif).
        </p>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="sr-only"
          onChange={(event) => void handleFiles(event.target.files)}
        />

        <Button
          type="button"
          variant="secondary"
          size="lg"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="h-5 w-5" aria-hidden />
          {isUploading ? 'Envoi en cours…' : 'Ajouter des photos'}
        </Button>

        {uploadError ? <p className="mt-2 text-body-sm text-red-600">{uploadError}</p> : null}
      </div>

      {sorted.length === 0 ? (
        <p className="rounded-card border border-neutral-200 bg-white p-4 text-body-sm text-neutral-600">
          Aucune photo pour le moment.
        </p>
      ) : (
        <ul className="space-y-4">
          {sorted.map((photo) => {
            const index = photos.findIndex(
              (item) =>
                (item.id && item.id === photo.id) ||
                (!item.id && item.url === photo.url && item.order === photo.order),
            );

            return (
              <li
                key={photo.id ?? `${photo.url}-${photo.order}`}
                className="rounded-card border border-neutral-200 bg-white p-4"
              >
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-button bg-neutral-100 sm:w-40">
                    <Image
                      src={resolveImageSrc(photo.url)}
                      alt={photo.altText || 'Photo du projet'}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  <div className="min-w-0 flex-1 space-y-3">
                    <div>
                      <Label htmlFor={`photo-alt-${index}`} required>
                        Description de la photo
                      </Label>
                      <Input
                        id={`photo-alt-${index}`}
                        value={photo.altText}
                        onChange={(event) => updatePhoto(index, { altText: event.target.value })}
                        placeholder="Ex. : Vue générale du chantier"
                        error={errors[index]?.altText}
                      />
                    </div>

                    <div>
                      <Label htmlFor={`photo-order-${index}`} required>
                        Ordre d’affichage
                      </Label>
                      <Input
                        id={`photo-order-${index}`}
                        type="number"
                        min={0}
                        value={photo.order}
                        onChange={(event) =>
                          updatePhoto(index, {
                            order: Number(event.target.value),
                          })
                        }
                        error={errors[index]?.order}
                      />
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="self-start text-red-600 hover:bg-red-50"
                    aria-label="Retirer cette photo"
                    onClick={() => removePhoto(index)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
