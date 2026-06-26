'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { cn } from '@/lib/cn';
import { resolveImageUrl } from '@/lib/utils';
import type { ProjectPhoto } from '@/types';

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  caption?: string | null;
}

interface ProjectDetailGalleryProps {
  images: GalleryImage[];
  projectName: string;
  sectorName?: string;
}

export function ProjectDetailGallery({
  images,
  projectName,
  sectorName,
}: ProjectDetailGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const safeIndex = Math.min(activeIndex, Math.max(0, images.length - 1));
  const active = images[safeIndex];
  const hasMultiple = images.length > 1;

  const goTo = useCallback(
    (index: number) => {
      if (images.length === 0) return;
      setActiveIndex((index + images.length) % images.length);
    },
    [images.length],
  );

  const thumbs = useMemo(() => images, [images]);

  if (!active) {
    return <div className="project-detail-gallery__empty">Image projet à venir</div>;
  }

  return (
    <div className="project-detail-gallery">
      <div className="project-detail-gallery__main">
        {sectorName ? (
          <div className="project-detail-gallery__sector">
            <span>{sectorName}</span>
          </div>
        ) : null}

        <Image
          key={active.id}
          src={resolveImageUrl(active.url)}
          alt={active.alt || `Vue du projet ${projectName}`}
          fill
          className="project-detail-gallery__main-image"
          sizes="(max-width: 1023px) 100vw, 50vw"
          priority={safeIndex === 0}
        />

        <div className="project-detail-gallery__shade" aria-hidden />

        {hasMultiple ? (
          <>
            <span className="project-detail-gallery__counter" aria-live="polite">
              {safeIndex + 1} / {images.length}
            </span>
            <div className="project-detail-gallery__nav">
              <button
                type="button"
                className="project-detail-gallery__nav-btn"
                onClick={() => goTo(safeIndex - 1)}
                aria-label="Image précédente"
              >
                <ChevronLeft className="h-5 w-5" strokeWidth={1.75} aria-hidden />
              </button>
              <button
                type="button"
                className="project-detail-gallery__nav-btn"
                onClick={() => goTo(safeIndex + 1)}
                aria-label="Image suivante"
              >
                <ChevronRight className="h-5 w-5" strokeWidth={1.75} aria-hidden />
              </button>
            </div>
          </>
        ) : null}

        {active.caption ? (
          <p className="project-detail-gallery__caption">{active.caption}</p>
        ) : null}
      </div>

      {hasMultiple ? (
        <div className="project-detail-gallery__thumbs" role="tablist" aria-label="Vues du projet">
          {thumbs.map((image, index) => (
            <button
              key={image.id}
              type="button"
              role="tab"
              onClick={() => setActiveIndex(index)}
              className={cn(
                'project-detail-gallery__thumb',
                index === safeIndex && 'project-detail-gallery__thumb--active',
              )}
              aria-label={`Afficher l’image ${index + 1}`}
              aria-selected={index === safeIndex}
            >
              <Image
                src={resolveImageUrl(image.url)}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 639px) 33vw, (max-width: 1023px) 25vw, 20vw"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function buildGalleryImages(
  mainImageUrl: string,
  photos: ProjectPhoto[] | undefined,
  projectName: string,
): GalleryImage[] {
  const items: GalleryImage[] = [
    {
      id: 'main',
      url: mainImageUrl,
      alt: `Vue principale du projet ${projectName}`,
      caption: null,
    },
  ];

  const sortedPhotos = [...(photos ?? [])].sort((a, b) => a.order - b.order);

  for (const photo of sortedPhotos) {
    const caption = photo.altText.trim();
    items.push({
      id: photo.id,
      url: photo.url,
      alt: caption || `Photo du projet ${projectName}`,
      caption: caption || null,
    });
  }

  return items;
}
