'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { resolveImageUrl } from '@/lib/utils';
import type { ProjectPhoto } from '@/types';

const LIGHTBOX_WIDTH = 1280;
const LIGHTBOX_HEIGHT = 853;
const THUMB_WIDTH = 480;
const THUMB_HEIGHT = 320;

interface ProjectGalleryProps {
  photos: ProjectPhoto[];
  projectName: string;
}

export function ProjectGallery({ photos, projectName }: ProjectGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);

  const showPrevious = useCallback(() => {
    setOpenIndex((current) => {
      if (current === null) {
        return null;
      }

      return current === 0 ? photos.length - 1 : current - 1;
    });
  }, [photos.length]);

  const showNext = useCallback(() => {
    setOpenIndex((current) => {
      if (current === null) {
        return null;
      }

      return current === photos.length - 1 ? 0 : current + 1;
    });
  }, [photos.length]);

  useEffect(() => {
    if (openIndex === null) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      }

      if (event.key === 'ArrowLeft') {
        showPrevious();
      }

      if (event.key === 'ArrowRight') {
        showNext();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [openIndex, close, showPrevious, showNext]);

  if (photos.length === 0) {
    return null;
  }

  const activePhoto = openIndex !== null ? photos[openIndex] : null;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => setOpenIndex(index)}
            className="group overflow-hidden rounded-card border border-border bg-neutral-100 text-left transition-shadow hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            <Image
              src={resolveImageUrl(photo.url)}
              alt={
                photo.altText.trim()
                  ? `${photo.altText} — projet ${projectName}`
                  : `Photo du projet ${projectName}`
              }
              width={THUMB_WIDTH}
              height={THUMB_HEIGHT}
              className="aspect-[3/2] h-auto w-full object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </button>
        ))}
      </div>

      {activePhoto && openIndex !== null ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-950/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Galerie photo — ${projectName}`}
        >
          <button
            type="button"
            onClick={close}
            className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
            aria-label="Fermer la galerie"
          >
            <X className="h-5 w-5" />
          </button>

          {photos.length > 1 ? (
            <>
              <button
                type="button"
                onClick={showPrevious}
                className="absolute left-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
                aria-label="Photo précédente"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={showNext}
                className="absolute right-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
                aria-label="Photo suivante"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          ) : null}

          <div className="max-h-[85vh] max-w-5xl">
            <Image
              src={resolveImageUrl(activePhoto.url)}
              alt={
                activePhoto.altText.trim()
                  ? `${activePhoto.altText} — projet ${projectName}`
                  : `Photo du projet ${projectName}`
              }
              width={LIGHTBOX_WIDTH}
              height={LIGHTBOX_HEIGHT}
              className="max-h-[75vh] w-auto rounded-card object-contain"
              sizes="100vw"
              priority
            />
            <p className="mt-4 text-center text-body-sm text-neutral-200">
              {activePhoto.altText} ({openIndex + 1}/{photos.length})
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
