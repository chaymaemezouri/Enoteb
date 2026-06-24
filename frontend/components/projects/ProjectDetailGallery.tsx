'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { cn } from '@/lib/cn';
import { resolveImageUrl } from '@/lib/utils';
import type { ProjectPhoto } from '@/types';

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
}

interface ProjectDetailGalleryProps {
  images: GalleryImage[];
  projectName: string;
}

export function ProjectDetailGallery({ images, projectName }: ProjectDetailGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const safeIndex = Math.min(activeIndex, Math.max(0, images.length - 1));
  const active = images[safeIndex];

  const thumbs = useMemo(() => images.slice(0, 5), [images]);

  if (!active) {
    return (
      <div className="flex aspect-[16/10] items-center justify-center bg-[#E8E4DC] text-sm text-[#6B7078]">
        Image projet à venir
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden bg-[#111820]">
        <Image
          key={active.id}
          src={resolveImageUrl(active.url)}
          alt={active.alt || `Vue du projet ${projectName}`}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 65vw"
          priority={safeIndex === 0}
        />
      </div>

      {thumbs.length > 1 ? (
        <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
          {thumbs.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                'link-focus relative aspect-square overflow-hidden border-2 bg-[#E8E4DC] transition-colors',
                index === safeIndex
                  ? 'border-[#FF6B1A]'
                  : 'border-transparent hover:border-[#252A30]/15',
              )}
              aria-label={`Afficher l’image ${index + 1}`}
              aria-current={index === safeIndex ? 'true' : undefined}
            >
              <Image
                src={resolveImageUrl(image.url)}
                alt=""
                fill
                className="object-cover"
                sizes="120px"
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
    },
  ];

  for (const photo of photos ?? []) {
    items.push({
      id: photo.id,
      url: photo.url,
      alt: photo.altText.trim() || `Photo du projet ${projectName}`,
    });
  }

  return items;
}
