'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { projectsPageContent } from '@/config/projects';
import type { Sector } from '@/types';
import { fadeUpView, PROJECTS_SHELL } from './projectsMotion';

interface ProjectsHeroProps {
  sector?: Sector;
}

export function ProjectsHero({ sector }: ProjectsHeroProps) {
  const { hero, sectorHero } = projectsPageContent;
  const reduced = useReducedMotion() ?? false;

  const sectorCopy = sector ? sectorHero[sector.slug] : undefined;
  const overline = sectorCopy?.overline ?? hero.overline;
  const titleLine1 = sector?.name ?? hero.titleLine1;
  const titleLine2 = sectorCopy?.titleSuffix ?? hero.titleLine2;
  const description = sector?.description?.trim() || sectorCopy?.description || hero.description;
  const showSecondary = !sector;
  const imageSrc = sector?.imageUrl?.trim() || hero.imageSrc;
  const imageAlt = sector
    ? `Réalisations ENOTEB — ${sector.name}`
    : hero.imageAlt;

  return (
    <section
      className="projects-hero relative flex min-h-[clamp(18rem,42vw,26rem)] flex-col overflow-hidden bg-[#071018] pt-28 sm:pt-32"
      data-header-theme="dark"
    >
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="projects-hero__image"
      />
      <div className="projects-hero__overlay" aria-hidden />
      <div className="projects-hero__base pointer-events-none absolute inset-0" aria-hidden />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-px bg-gradient-to-r from-transparent via-[rgba(255,106,26,0.28)] to-transparent"
        aria-hidden
      />

      <div className={`projects-hero__inner relative z-10 flex flex-1 items-end pb-12 sm:pb-14 ${PROJECTS_SHELL}`}>
        <motion.div {...fadeUpView(0, reduced)} className="max-w-2xl">
          <div className="flex items-center gap-2.5">
            <span className="h-px w-7 shrink-0 bg-[#FF6A1A]/80" aria-hidden />
            <p className="text-[0.625rem] font-semibold uppercase tracking-[0.32em] text-[#FF6A1A]">
              {overline}
            </p>
          </div>

          <h1 className="mt-4 font-sans text-[clamp(1.875rem,4.8vw,3.25rem)] font-bold leading-[1.06] tracking-[-0.03em] text-[#F8F5EE] sm:mt-5">
            {titleLine1}
            <span className="mt-1 block text-[#FF6A1A]">{titleLine2}</span>
          </h1>

          <p className="mt-4 max-w-xl text-[0.9375rem] leading-[1.7] text-[rgba(248,245,238,0.68)] sm:mt-5 sm:text-base">
            {description}
          </p>

          {showSecondary ? (
            <p className="mt-3 max-w-xl text-[0.875rem] leading-[1.65] text-[rgba(248,245,238,0.48)] sm:text-[0.9375rem]">
              {hero.descriptionSecondary}
            </p>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}
