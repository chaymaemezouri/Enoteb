'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { homeContent } from '@/config/home';
import { ProjectShowcaseCard } from '@/components/projects/ProjectShowcaseCard';
import type { ProjectSummary } from '@/types';
import { fadeUpView } from './homeMotion';

const BG_WARM = '#F6F2EA';
const MUTED = '#68717D';

interface ProjectsPreviewProps {
  projects: ProjectSummary[];
}

export function ProjectsPreview({ projects }: ProjectsPreviewProps) {
  const { projects: content } = homeContent;
  const reduced = useReducedMotion() ?? false;
  const displayProjects = projects.slice(0, 3);

  return (
    <section
      className="relative scroll-mt-28 overflow-x-hidden py-14 home-shell sm:py-16 md:pb-28 md:pt-20 lg:pb-32 lg:pt-24"
      style={{ backgroundColor: BG_WARM }}
      data-header-theme="light"
      aria-labelledby="projects-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(24,33,43,0.022)_1px,transparent_1px),linear-gradient(90deg,rgba(24,33,43,0.022)_1px,transparent_1px)] bg-[size:72px_72px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FF6A1A]/10 to-transparent"
        aria-hidden
      />

      <div className="relative w-full">
        <div className="mx-auto max-w-[850px] text-center">
          <motion.h2
            {...fadeUpView(0, reduced)}
            id="projects-heading"
            className="enoteb-title enoteb-title--section enoteb-title--on-light"
          >
            {content.title}
          </motion.h2>

          <motion.p
            {...fadeUpView(0.16, reduced)}
            className="enoteb-lead enoteb-lead--on-light mx-auto mt-4 max-w-[720px]"
          >
            {content.description}
          </motion.p>
        </div>

        {displayProjects.length > 0 ? (
          <div className="mt-10 grid gap-5 sm:mt-12 md:grid-cols-2 lg:grid-cols-12 lg:items-stretch lg:gap-7">
            <div className="md:col-span-2 lg:col-span-7">
              <ProjectShowcaseCard
                project={displayProjects[0]}
                index={0}
                variant="featured"
                delay={0.12}
              />
            </div>

            <div className="flex flex-col gap-5 lg:col-span-5 lg:gap-7">
              {displayProjects[1] ? (
                <ProjectShowcaseCard
                  project={displayProjects[1]}
                  index={1}
                  variant="compact"
                  delay={0.18}
                />
              ) : null}

              {displayProjects[2] ? (
                <ProjectShowcaseCard
                  project={displayProjects[2]}
                  index={2}
                  variant="compact"
                  delay={0.24}
                />
              ) : null}
            </div>
          </div>
        ) : (
          <p className="mt-10 text-center text-base leading-[1.6]" style={{ color: MUTED }}>
            Nos projets seront bientôt disponibles.
          </p>
        )}

        <motion.div {...fadeUpView(0.28, reduced)} className="mt-10 flex justify-end sm:mt-12">
          <Link
            href="/projets"
            className="link-focus inline-flex items-center gap-2.5 rounded-none border border-[#18212B]/14 bg-[#F6F2EA] px-6 py-3 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-[#18212B] transition-colors duration-300 hover:border-[#FF6A1A]/50 hover:text-[#FF6A1A] focus-visible:ring-[#FF6A1A]"
          >
            {content.ctaLabel}
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
