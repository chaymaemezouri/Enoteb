'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { resolveIndustrialImage } from '@/lib/utils';
import type { Sector } from '@/types';
import { fadeUpView } from './sectorsMotion';

interface SectorsGridCardProps {
  sector: Sector;
  variant: 'top' | 'bottom';
  delay?: number;
}

export function SectorsGridCard({ sector, variant, delay = 0 }: SectorsGridCardProps) {
  const reduced = useReducedMotion() ?? false;
  const imageUrl = resolveIndustrialImage(sector.imageUrl, sector.slug);

  return (
    <motion.article
      {...fadeUpView(delay, reduced)}
      className="group relative min-h-[260px] overflow-hidden sm:min-h-[300px] lg:min-h-[320px]"
    >
      <Link
        href={`/secteurs/${sector.slug}`}
        className="link-focus absolute inset-0 z-10 focus-visible:ring-2 focus-visible:ring-[#FF6B1A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F2EC]"
        aria-label={`${sector.name} — voir les projets`}
      >
        <span className="sr-only">{sector.name}</span>
      </Link>

      <Image
        src={imageUrl}
        alt=""
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        sizes={
          variant === 'bottom' ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, 33vw'
        }
      />

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#111820]/95 via-[#111820]/42 to-[#111820]/10"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[#111820]/10 transition-colors duration-500 group-hover:bg-[#111820]/0"
        aria-hidden
      />

      <div className="absolute inset-x-0 bottom-0 z-[1] p-5 sm:p-6 lg:p-7">
        <h2 className="text-[clamp(1.25rem,2vw,1.625rem)] font-bold uppercase tracking-[0.06em] text-white">
          {sector.name}
        </h2>
        <span className="mt-3 inline-flex items-center gap-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[#FF6B1A] transition-transform duration-300 group-hover:gap-2.5">
          Voir les projets
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
        </span>
      </div>
    </motion.article>
  );
}
