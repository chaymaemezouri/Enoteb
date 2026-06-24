'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { projectsPageContent } from '@/config/projects';
import { Container } from '@/components/ui/Container';
import { fadeUpView, PROJECTS_CONTAINER } from './projectsMotion';

interface ProjectsHeroProps {
  sectorName?: string;
}

export function ProjectsHero({ sectorName }: ProjectsHeroProps) {
  const { hero } = projectsPageContent;
  const reduced = useReducedMotion() ?? false;

  const titleLine1 = sectorName ?? hero.titleLine1;
  const titleLine2 = sectorName ? 'Projets' : hero.titleLine2;

  return (
    <section
      className="relative min-h-[min(68vh,580px)] overflow-hidden bg-[#111820] sm:min-h-[min(72vh,640px)]"
      data-header-theme="dark"
    >
      <Image
        src={hero.imageSrc}
        alt=""
        fill
        className="object-cover brightness-[0.4] contrast-[1.06]"
        sizes="100vw"
        priority
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#111820]/94 via-[#111820]/62 to-[#111820]/35"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#111820]/75 via-transparent to-[#111820]/25"
        aria-hidden
      />

      <Container
        fluid
        className={`relative z-10 flex min-h-[min(68vh,580px)] items-end pb-12 pt-28 sm:min-h-[min(72vh,640px)] sm:pb-16 sm:pt-32 ${PROJECTS_CONTAINER}`}
      >
        <motion.div {...fadeUpView(0, reduced)} className="max-w-2xl">
          <div className="flex items-start gap-4">
            <span className="mt-2 h-12 w-px shrink-0 bg-[#FF6B1A]" aria-hidden />
            <div>
              <h1 className="font-display text-[clamp(2.25rem,5vw,3.75rem)] font-bold leading-[1.02] tracking-[-0.03em] text-[#F5F1EA]">
                {titleLine1}
                <span className="mt-1 block text-[#FF6B1A]">{titleLine2}</span>
              </h1>
              <p className="mt-5 max-w-xl text-[0.9375rem] leading-relaxed text-[#F5F1EA]/82 sm:text-base">
                {hero.description}
              </p>
              <p className="mt-3 max-w-xl text-[0.875rem] leading-relaxed text-[#F5F1EA]/62 sm:text-[0.9375rem]">
                {hero.descriptionSecondary}
              </p>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
