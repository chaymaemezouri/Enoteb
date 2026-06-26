'use client';

import { Container } from '@/components/ui/Container';
import type { Sector } from '@/types';
import { SectorsGridCard } from './SectorsGridCard';
import { SECTORS_SHELL } from './sectorsMotion';

interface SectorsGridProps {
  sectors: Sector[];
}

function bottomColSpan(count: number): string {
  if (count === 1) {
    return 'md:col-span-6';
  }

  if (count === 2) {
    return 'md:col-span-3';
  }

  return 'md:col-span-2';
}

export function SectorsGrid({ sectors }: SectorsGridProps) {
  const ordered = [...sectors].sort((a, b) => a.order - b.order);
  const topRow = ordered.slice(0, Math.min(3, ordered.length));
  const bottomRow = ordered.slice(3);
  const bottomSpan = bottomColSpan(bottomRow.length);

  if (ordered.length === 0) {
    return (
      <section className="bg-[#F6F2EA] py-16 sm:py-20" data-header-theme="light">
        <Container fluid className={SECTORS_SHELL}>
          <p className="text-center text-[#68717D]">Nos secteurs seront bientôt disponibles.</p>
        </Container>
      </section>
    );
  }

  return (
    <section
      className="bg-[#F6F2EA] pb-12 sm:pb-16 lg:pb-20"
      data-header-theme="light"
      aria-label="Grille des secteurs"
    >
      <Container fluid className={SECTORS_SHELL}>
        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-6">
          {topRow.map((sector, index) => (
            <div key={sector.id} className="md:col-span-2">
              <SectorsGridCard sector={sector} variant="top" delay={index * 0.08} />
            </div>
          ))}

          {bottomRow.map((sector, index) => (
            <div key={sector.id} className={bottomSpan}>
              <SectorsGridCard sector={sector} variant="bottom" delay={0.24 + index * 0.08} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
