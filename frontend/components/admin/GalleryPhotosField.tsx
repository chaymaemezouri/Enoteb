'use client';

import Image from 'next/image';
import { useMemo, useRef, useState } from 'react';
import { Trash2, Upload } from 'lucide-react';
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

  const sortedEntries = useMemo(
    () =>
      photos
        .map((photo, index) => ({ photo, index }))
        .sort((a, b) => a.photo.order - b.photo.order),
    [photos],
  );

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
        'Certaines images n\u2019ont pas pu être envoyées. Réessayez avec des fichiers JPG, PNG ou WebP (20 Mo max).',
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

  return (
    <div className="admin-gallery-field">
      <div>
        <span className="admin-field__label">Photos de la galerie</span>
        <p className="admin-field__hint admin-gallery-field__hint">
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

        <button
          type="button"
          className="admin-btn admin-btn--secondary admin-btn--sm"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="h-4 w-4" aria-hidden />
          {isUploading ? 'Envoi en cours…' : 'Ajouter des photos'}
        </button>

        {uploadError ? <p className="admin-field__error">{uploadError}</p> : null}
      </div>

      {sortedEntries.length === 0 ? (
        <p className="admin-field__hint">Aucune photo pour le moment.</p>
      ) : (
        <ul className="admin-gallery-field__list">
          {sortedEntries.map(({ photo, index }) => (
            <li
              key={photo.id ?? `new-${index}-${photo.url}`}
              className="admin-gallery-item"
            >
              <div className="admin-gallery-item__row">
                <div className="admin-upload__preview admin-upload__preview--thumb">
                  <Image
                    src={resolveImageSrc(photo.url)}
                    alt={photo.altText || 'Photo du projet'}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                <div className="admin-gallery-item__fields">
                  <div className="admin-gallery-item__field admin-gallery-item__field--description">
                    <label
                      htmlFor={`photo-alt-${index}`}
                      className="admin-field__label admin-field__label--required"
                    >
                      Description de la photo
                    </label>
                    <input
                      id={`photo-alt-${index}`}
                      className="admin-field__input admin-gallery-item__input"
                      value={photo.altText}
                      onChange={(event) => updatePhoto(index, { altText: event.target.value })}
                      placeholder="Ex. : Vue générale du chantier"
                    />
                    {errors[index]?.altText ? (
                      <p className="admin-field__error">{errors[index]?.altText}</p>
                    ) : null}
                  </div>

                  <div className="admin-gallery-item__field admin-gallery-item__field--order">
                    <label
                      htmlFor={`photo-order-${index}`}
                      className="admin-field__label admin-field__label--required"
                    >
                      Ordre d&apos;affichage
                    </label>
                    <input
                      id={`photo-order-${index}`}
                      type="number"
                      min={0}
                      className="admin-field__input admin-gallery-item__input admin-gallery-item__input--order"
                      value={Number.isFinite(photo.order) ? photo.order : ''}
                      onChange={(event) => {
                        const nextOrder = event.target.value.trim();
                        updatePhoto(index, {
                          order: nextOrder === '' ? Number.NaN : Number(nextOrder),
                        });
                      }}
                    />
                    {errors[index]?.order ? (
                      <p className="admin-field__error">{errors[index]?.order}</p>
                    ) : null}
                  </div>
                </div>

                <button
                  type="button"
                  className="admin-btn admin-btn--danger admin-btn--icon admin-gallery-item__remove"
                  aria-label="Retirer cette photo"
                  onClick={() => removePhoto(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
