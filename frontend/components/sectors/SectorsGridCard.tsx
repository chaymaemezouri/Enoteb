'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { DEFAULT_SECTOR_IMAGE, getSectorCatalogImage } from '@/lib/utils';
import type { Sector } from '@/types';
import { fadeUpView } from './sectorsMotion';

interface SectorsGridCardProps {
  sector: Sector;
  variant: 'top' | 'bottom';
  delay?: number;
}

export function SectorsGridCard({ sector, variant, delay = 0 }: SectorsGridCardProps) {
  const reduced = useReducedMotion() ?? false;
  const catalogSrc = getSectorCatalogImage(sector.slug);
  const [imageSrc, setImageSrc] = useState(catalogSrc);
  const [usedFallback, setUsedFallback] = useState(false);

  return (
    <motion.article
      {...fadeUpView(delay, reduced)}
      className="sectors-grid-card group relative min-h-[260px] overflow-hidden sm:min-h-[300px] lg:min-h-[320px]"
    >
      <Link
        href={`/secteurs/${sector.slug}`}
        className="link-focus absolute inset-0 z-10 focus-visible:ring-2 focus-visible:ring-[#FF6A1A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F3F0E8]"
        aria-label={`${sector.name} — voir les projets`}
      >
        <span className="sr-only">{sector.name}</span>
      </Link>

      <Image
        src={imageSrc}
        alt=""
        fill
        unoptimized={imageSrc.startsWith('http')}
        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        sizes={
          variant === 'bottom' ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, 33vw'
        }
        onError={() => {
          if (!usedFallback) {
            setUsedFallback(true);
            setImageSrc(DEFAULT_SECTOR_IMAGE);
          }
        }}
      />

      <span className="sectors-grid-card__corner-v" aria-hidden />
      <span className="sectors-grid-card__corner-h" aria-hidden />

      <div className="sectors-grid-card__overlay" aria-hidden />
      <div className="sectors-grid-card__glow" aria-hidden />

      <div className="absolute inset-x-0 bottom-0 z-[1] p-5 sm:p-6 lg:p-7">
        <p className="sectors-grid-card__tag">Secteur</p>
        <h2 className="sectors-grid-card__title">{sector.name}</h2>
        <span className="sectors-grid-card__cta">
          Voir les projets
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
        </span>
      </div>
    </motion.article>
  );
}
