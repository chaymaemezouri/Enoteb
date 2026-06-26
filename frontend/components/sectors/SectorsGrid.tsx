'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { sectorsPageContent } from '@/config/sectors';
import { Container } from '@/components/ui/Container';
import { SectionLabel } from '@/components/ui/SectionLabel';
import type { Sector } from '@/types';
import { SectorsGridCard } from './SectorsGridCard';
import { fadeUpView, SECTORS_SHELL } from './sectorsMotion';

interface SectorsGridProps {
  sectors: Sector[];
}

function pickSectors(slugs: readonly string[], sectors: Sector[]) {
  return slugs
    .map((slug) => sectors.find((sector) => sector.slug === slug))
    .filter((sector): sector is Sector => Boolean(sector));
}

export function SectorsGrid({ sectors }: SectorsGridProps) {
  const { grid } = sectorsPageContent;
  const reduced = useReducedMotion() ?? false;
  const topRow = pickSectors(grid.topRowSlugs, sectors);
  const bottomRow = pickSectors(grid.bottomRowSlugs, sectors);

  if (topRow.length === 0 && bottomRow.length === 0) {
    return (
      <section className="bg-[#F3F0E8] py-16 sm:py-20" data-header-theme="light">
        <Container fluid className={SECTORS_SHELL}>
          <p className="text-center text-[#68717D]">Nos secteurs seront bientôt disponibles.</p>
        </Container>
      </section>
    );
  }

  return (
    <section
      className="bg-[#F3F0E8] py-12 sm:py-16 lg:py-20"
      data-header-theme="light"
      aria-labelledby="sectors-grid-heading"
    >
      <Container fluid className={SECTORS_SHELL}>
        <motion.header {...fadeUpView(0, reduced)} className="mb-8 max-w-xl sm:mb-10">
          <SectionLabel>{grid.overline}</SectionLabel>
          <h2
            id="sectors-grid-heading"
            className="enoteb-title enoteb-title--section enoteb-title--on-light mt-4 sm:mt-5"
          >
            {grid.title}
          </h2>
        </motion.header>

        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-6">
          {topRow.map((sector, index) => (
            <div key={sector.id} className="md:col-span-2">
              <SectorsGridCard sector={sector} variant="top" delay={index * 0.08} />
            </div>
          ))}

          {bottomRow.map((sector, index) => (
            <div key={sector.id} className="md:col-span-3">
              <SectorsGridCard sector={sector} variant="bottom" delay={0.24 + index * 0.08} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
