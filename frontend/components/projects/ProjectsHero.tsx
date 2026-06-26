'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { projectsPageContent } from '@/config/projects';
import type { Sector } from '@/types';
import { fadeUpView } from './projectsMotion';

interface ProjectsHeroProps {
  sector?: Sector;
}

export function ProjectsHero({ sector }: ProjectsHeroProps) {
  const { hero, sectorHero } = projectsPageContent;
  const reduced = useReducedMotion() ?? false;

  const sectorCopy = sector ? sectorHero[sector.slug] : undefined;
  const titleLine1 = sector?.name ?? hero.titleLine1;
  const titleLine2 = sectorCopy?.titleSuffix ?? hero.titleLine2;
  const description = sector?.description?.trim() || sectorCopy?.description || hero.description;

  return (
    <header className="projects-hero">
      <motion.div {...fadeUpView(0, reduced)} className="max-w-2xl">
        <h1 id="projects-hero-title" className="enoteb-title enoteb-title--hero enoteb-title--on-light">
          <span className="block">{titleLine1}</span>
          {!sector ? (
            <span className="mt-1 block text-[#FF6A1A] sm:mt-1.5">{titleLine2}</span>
          ) : null}
        </h1>

        <p className="enoteb-lead enoteb-lead--on-light mt-5 max-w-xl sm:mt-6">{description}</p>
      </motion.div>
    </header>
  );
}
