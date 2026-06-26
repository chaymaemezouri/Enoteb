'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { sectorsPageContent } from '@/config/sectors';
import { fadeUpView, SECTORS_SHELL } from './sectorsMotion';

export function SectorsHero() {
  const { hero } = sectorsPageContent;
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      className="sectors-page-hero relative overflow-hidden bg-[#F6F2EA] pt-28 sm:pt-32"
      data-header-theme="light"
    >
      <div className="about-v2-sand-grid about-v2-sand-grid--soft pointer-events-none absolute inset-0" aria-hidden />

      <div className={`relative ${SECTORS_SHELL} pb-6 sm:pb-8`}>
        <motion.div {...fadeUpView(0, reduced)} className="sectors-page-hero__inner">
          <span className="about-v2-accent-mark" aria-hidden />
          <h1 className="sectors-page-hero__title enoteb-title enoteb-title--on-light">
            {hero.titleLine1}{' '}
            <span className="text-[#FF6A1A]">{hero.titleLine2}</span>
          </h1>
          <p className="sectors-page-hero__lead enoteb-lead enoteb-lead--on-light">{hero.description}</p>
        </motion.div>
      </div>
    </section>
  );
}
