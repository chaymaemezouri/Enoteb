'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { Camera, Trash2 } from 'lucide-react';
import { uploadImage, resolveAdminAvatarUrl } from '@/lib/admin-utils';

interface ProfileAvatarFieldProps {
  name: string;
  value: string;
  accessToken: string;
  onChange: (url: string) => void;
}

function resolveImageSrc(url: string): string {
  return resolveAdminAvatarUrl(url) ?? url;
}

export function ProfileAvatarField({
  name,
  value,
  accessToken,
  onChange,
}: ProfileAvatarFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initial = name.trim().charAt(0).toUpperCase() || 'A';

  async function handleFileChange(file: File | undefined) {
    if (!file) {
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const url = await uploadImage(file, accessToken);
      onChange(url);
    } catch {
      setError('Impossible d\u2019envoyer cette image. JPG, PNG ou WebP (20 Mo max).');
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="admin-profile-avatar">
      <div className="admin-profile-avatar__preview">
        {value ? (
          <Image
            src={resolveImageSrc(value)}
            alt={`Photo de ${name}`}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <span className="admin-profile-avatar__initial" aria-hidden>
            {initial}
          </span>
        )}

        <button
          type="button"
          className="admin-profile-avatar__camera"
          disabled={isUploading}
          aria-label="Changer la photo de profil"
          onClick={() => inputRef.current?.click()}
        >
          <Camera className="h-3.5 w-3.5" aria-hidden />
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(event) => void handleFileChange(event.target.files?.[0])}
        />
      </div>

      <div className="admin-profile-avatar__actions">
        <button
          type="button"
          className="admin-btn admin-btn--secondary admin-btn--sm"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
        >
          {isUploading ? 'Envoi…' : value ? 'Changer la photo' : 'Ajouter une photo'}
        </button>
        {value ? (
          <button
            type="button"
            className="admin-icon-btn admin-icon-btn--ghost"
            aria-label="Supprimer la photo"
            title="Supprimer la photo"
            disabled={isUploading}
            onClick={() => onChange('')}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>

      {error ? <p className="admin-field__error">{error}</p> : null}
    </div>
  );
}
