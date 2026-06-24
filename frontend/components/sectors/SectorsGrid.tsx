'use client';

import { sectorsPageContent } from '@/config/sectors';
import { Container } from '@/components/ui/Container';
import type { Sector } from '@/types';
import { SectorsGridCard } from './SectorsGridCard';
import { SECTORS_CONTAINER } from './sectorsMotion';

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
  const topRow = pickSectors(grid.topRowSlugs, sectors);
  const bottomRow = pickSectors(grid.bottomRowSlugs, sectors);

  if (topRow.length === 0 && bottomRow.length === 0) {
    return (
      <section className="bg-[#F5F2EC] py-16 sm:py-20" data-header-theme="light">
        <Container fluid className={SECTORS_CONTAINER}>
          <p className="text-center text-[#6B7078]">Nos secteurs seront bientôt disponibles.</p>
        </Container>
      </section>
    );
  }

  return (
    <section className="bg-[#F5F2EC] py-12 sm:py-16 lg:py-20" data-header-theme="light">
      <Container fluid className={SECTORS_CONTAINER}>
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
