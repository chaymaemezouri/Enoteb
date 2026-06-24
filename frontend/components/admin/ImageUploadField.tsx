'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
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
        'Impossible d’envoyer cette image. Choisissez un fichier JPG ou PNG (5 Mo max).',
      );
    } finally {
      setIsUploading(false);
    }
  }

  const displayError = error ?? uploadError ?? undefined;

  return (
    <div>
      <Label required={required}>{label}</Label>
      <div
        className={cn(
          'rounded-card border border-dashed border-neutral-300 bg-white p-4',
          displayError && 'border-red-500',
        )}
      >
        {value ? (
          <div className="relative mb-4 aspect-video w-full max-w-md overflow-hidden rounded-button bg-neutral-100">
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

        <Button
          type="button"
          variant="secondary"
          size="lg"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="h-5 w-5" aria-hidden />
          {isUploading ? 'Envoi en cours…' : value ? 'Changer l’image' : 'Choisir une image'}
        </Button>
      </div>

      {displayError ? <p className="mt-1.5 text-body-sm text-red-600">{displayError}</p> : null}
    </div>
  );
}
