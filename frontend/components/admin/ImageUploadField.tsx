'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { uploadImage } from '@/lib/admin-utils';
import { getApiUrl } from '@/lib/api';
import { cn } from '@/lib/cn';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  accessToken: string;
  onChange: (url: string) => void;
  error?: string;
  required?: boolean;
}

function resolveImageSrc(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  return `${getApiUrl()}${url}`;
}

export function ImageUploadField({
  label,
  value,
  accessToken,
  onChange,
  error,
  required,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFileChange(file: File | undefined) {
    if (!file) {
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const url = await uploadImage(file, accessToken);
      onChange(url);
    } catch {
      setUploadError(
        'Impossible d\u2019envoyer cette image. Choisissez un fichier JPG, PNG ou WebP (20 Mo max).',
      );
    } finally {
      setIsUploading(false);
    }
  }

  const displayError = error ?? uploadError ?? undefined;

  return (
    <div>
      <span className={cn('admin-field__label', required && 'admin-field__label--required')}>
        {label}
      </span>
      <div className={cn('admin-upload', displayError && 'admin-upload--error')}>
        {value ? (
          <div className="admin-upload__preview">
            <Image
              src={resolveImageSrc(value)}
              alt="Aperçu"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        ) : null}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(event) => void handleFileChange(event.target.files?.[0])}
        />

        <button
          type="button"
          className="admin-btn admin-btn--secondary admin-btn--sm"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="h-4 w-4" aria-hidden />
          {isUploading ? 'Envoi en cours…' : value ? 'Changer l\u2019image' : 'Choisir une image'}
        </button>
      </div>

      {displayError ? <p className="admin-field__error">{displayError}</p> : null}
    </div>
  );
}
