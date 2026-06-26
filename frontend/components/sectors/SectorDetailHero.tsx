'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { sectorsPageContent } from '@/config/sectors';
import type { Sector } from '@/types';
import { fadeUpView, SECTORS_SHELL } from './sectorsMotion';

interface SectorDetailHeroProps {
  sector: Pick<Sector, 'name' | 'slug' | 'description'>;
}

export function SectorDetailHero({ sector }: SectorDetailHeroProps) {
  const { sectorHero } = sectorsPageContent;
  const reduced = useReducedMotion() ?? false;
  const copy = sectorHero[sector.slug];
  const overline = copy?.overline ?? `Secteur ${sector.name}`;
  const titleSuffix = copy?.titleSuffix ?? 'Projets & réalisations';
  const description = sector.description?.trim() || '';

  return (
    <section
      className="projects-hero relative flex min-h-0 flex-col overflow-hidden bg-[#071018] py-20 pt-28 sm:py-24 sm:pt-32 md:py-28 md:pt-36"
      data-header-theme="dark"
    >
      <div className="projects-hero__base pointer-events-none absolute inset-0" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_0%_0%,rgba(255,106,26,0.07),transparent_58%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,106,26,0.28)] to-transparent"
        aria-hidden
      />

      <div className={`projects-hero__inner relative z-10 ${SECTORS_SHELL}`}>
        <motion.div {...fadeUpView(0, reduced)} className="max-w-2xl">
          <SectionLabel>{overline}</SectionLabel>

          <h1 className="enoteb-title enoteb-title--hero enoteb-title--on-dark mt-5 sm:mt-6">
            <span className="block">{sector.name}</span>
            <span className="mt-1 block text-[#FF6A1A] sm:mt-1.5">{titleSuffix}</span>
          </h1>

          {description ? (
            <p className="enoteb-lead enoteb-lead--on-dark mt-5 sm:mt-6">{description}</p>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}
