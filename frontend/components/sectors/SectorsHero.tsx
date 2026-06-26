'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { sectorsPageContent } from '@/config/sectors';
import { fadeUpView, SECTORS_SHELL } from './sectorsMotion';

export function SectorsHero() {
  const { hero } = sectorsPageContent;
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      className="sectors-page-hero relative overflow-hidden bg-[#F3F0E8] pt-28 sm:pt-32"
      data-header-theme="light"
    >
      <div className="about-v2-sand-grid pointer-events-none absolute inset-0 opacity-50" aria-hidden />

      <div className={`relative ${SECTORS_SHELL} pb-10 sm:pb-12 lg:pb-14`}>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <motion.div {...fadeUpView(0, reduced)} className="max-w-2xl">
            <SectionLabel>{hero.overline}</SectionLabel>

            <h1 className="enoteb-title enoteb-title--hero enoteb-title--on-light mt-5 sm:mt-6">
              <span className="block">{hero.titleLine1}</span>
              <span className="mt-1 block text-[#FF6A1A] sm:mt-1.5">{hero.titleLine2}</span>
            </h1>

            <p className="enoteb-lead enoteb-lead--on-light mt-5 sm:mt-6">{hero.description}</p>
          </motion.div>

          <motion.div
            {...fadeUpView(0.08, reduced)}
            className="sectors-page-hero__aside shrink-0"
            aria-hidden
          >
            <p className="sectors-page-hero__count">05</p>
            <p className="sectors-page-hero__count-label">secteurs</p>
          </motion.div>
        </div>

        <div className="sectors-page-hero__rule" aria-hidden />
      </div>
    </section>
  );
}
