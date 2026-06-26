'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { homeContent } from '@/config/home';
import { getApiUrl } from '@/lib/api';
import { cn } from '@/lib/cn';
import type { ProjectSummary } from '@/types';
import { fadeUpView, HOME_EASE, HOME_VIEWPORT } from './homeMotion';

const NAVY = '#18212B';
const MUTED = '#68717D';
const BG_WARM = '#F6F2EA';

const CINEMATIC_OVERLAY =
  'linear-gradient(180deg, rgba(8,15,25,0.18) 0%, rgba(8,15,25,0.52) 55%, rgba(8,15,25,0.9) 100%)';

function hasValidProjectImage(url: string | null | undefined): boolean {
  if (!url?.trim()) return false;
  return !url.includes('picsum.photos');
}

function projectImageSrc(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  if (url.startsWith('/uploads/')) {
    return `${getApiUrl()}${url}`;
  }
  return url;
}

function sectorCategory(sector?: { name: string; slug: string }): string {
  if (!sector?.name?.trim()) return 'Projet';
  return sector.name;
}

function formatLocationYear(
  location: string | null | undefined,
  year: number | null | undefined,
): string | null {
  const loc = location?.trim();
  const parts = [loc, year ? String(year) : null].filter(Boolean);
  return parts.length ? parts.join(' · ') : null;
}

function ProjectImagePlaceholder() {
  return (
    <div
      className="absolute inset-0 bg-[linear-gradient(145deg,#0B1117_0%,#121a24_48%,#0D131A_100%)]"
      aria-hidden
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.028)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.028)_1px,transparent_1px)] bg-[size:44px_44px] opacity-45"
        aria-hidden
      />
      <p className="absolute inset-0 flex items-center justify-center px-6 text-center text-[0.5625rem] font-medium uppercase tracking-[0.22em] text-white/28">
        Image projet à venir
      </p>
    </div>
  );
}

function ProjectShowcaseImage({
  project,
  isFeatured,
}: {
  project: ProjectSummary;
  isFeatured: boolean;
}) {
  const hasImage = hasValidProjectImage(project.mainImageUrl);
  const [failed, setFailed] = useState(false);
  const showPlaceholder = !hasImage || failed;

  useEffect(() => {
    setFailed(false);
  }, [project.id, project.mainImageUrl]);

  if (showPlaceholder) {
    return <ProjectImagePlaceholder />;
  }

  return (
    <Image
      src={projectImageSrc(project.mainImageUrl)}
      alt=""
      fill
      unoptimized={project.mainImageUrl.startsWith('/uploads/')}
      className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.04]"
      sizes={isFeatured ? '(max-width: 1024px) 100vw, 58vw' : '(max-width: 1024px) 100vw, 34vw'}
      onError={() => setFailed(true)}
    />
  );
}

function ProjectShowcaseCard({
  project,
  index,
  variant,
  reduced,
}: {
  project: ProjectSummary;
  index: number;
  variant: 'featured' | 'compact';
  reduced: boolean;
}) {
  const isFeatured = variant === 'featured';
  const number = String(index + 1).padStart(2, '0');
  const locationYear = formatLocationYear(project.location, project.year);
  const ariaParts = [project.name, locationYear, sectorCategory(project.sector)].filter(Boolean);

  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={HOME_VIEWPORT}
      transition={{ duration: 0.75, delay: 0.12 + index * 0.1, ease: HOME_EASE }}
      className="h-full"
    >
      <Link
        href={`/projets/${project.slug}`}
        aria-label={ariaParts.join(', ')}
        className="card-link group relative flex h-full flex-col overflow-hidden rounded-none border border-[#18212B]/12 bg-[#18212B] shadow-[0_20px_52px_-22px_rgba(24,33,43,0.35)] transition-[box-shadow,border-color] duration-500 hover:border-[#FF6A1A]/30 hover:shadow-[0_28px_60px_-20px_rgba(24,33,43,0.42)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A1A]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F6F2EA]"
      >
        <div
          className={cn(
            'relative w-full flex-1 overflow-hidden',
            isFeatured
              ? 'min-h-[380px] sm:min-h-[440px] lg:min-h-[540px]'
              : 'min-h-[220px] sm:min-h-[248px] lg:min-h-[258px]',
          )}
        >
          <ProjectShowcaseImage project={project} isFeatured={isFeatured} />

          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-500 group-hover:opacity-90"
            style={{ background: CINEMATIC_OVERLAY }}
            aria-hidden
          />

          <span
            className={cn(
              'pointer-events-none absolute right-3 top-3 select-none font-sans font-bold leading-none tracking-[-0.05em] text-white/[0.06]',
              isFeatured ? 'text-[5rem] lg:text-[6rem]' : 'text-[3.5rem] lg:text-[4rem]',
            )}
            aria-hidden
          >
            {number}
          </span>

          <span
            className="pointer-events-none absolute left-0 top-0 z-10 h-7 w-px bg-[#FF6A1A]"
            aria-hidden
          />
          <span
            className="pointer-events-none absolute left-0 top-0 z-10 h-px w-7 bg-[#FF6A1A]"
            aria-hidden
          />

          <div
            className={cn(
              'absolute inset-x-0 bottom-0 z-10 flex flex-col',
              isFeatured ? 'p-6 sm:p-8' : 'p-5 sm:p-6',
            )}
          >
            <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.22em] text-[#FF6A1A]">
              {sectorCategory(project.sector)}
            </p>

            <h3
              className={cn(
                'mt-2 font-bold leading-snug tracking-[-0.02em] text-[#F8F5EE]',
                isFeatured
                  ? 'text-[clamp(1.25rem,2vw,1.75rem)]'
                  : 'text-[clamp(1.0625rem,1.4vw,1.25rem)]',
              )}
            >
              {project.name}
            </h3>

            {locationYear ? (
              <p
                className={cn(
                  'mt-2 text-[rgba(248,245,238,0.72)]',
                  isFeatured ? 'text-sm' : 'text-xs sm:text-sm',
                )}
              >
                {locationYear}
              </p>
            ) : null}

            <span className="mt-4 inline-flex w-fit items-center gap-1.5 border border-white/20 bg-white/[0.04] px-3 py-2 text-[0.5625rem] font-semibold uppercase tracking-[0.14em] text-[#F8F5EE] transition-colors duration-300 group-hover:border-[#FF6A1A]/45 group-hover:text-[#FF6A1A]">
              Voir le projet
              <ArrowUpRight className="h-3 w-3" aria-hidden />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

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
          <motion.div {...fadeUpView(0, reduced)}>
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-[#FF6A1A]" aria-hidden />
              <p className="section-label">{content.overline}</p>
              <span className="h-px w-8 bg-[#FF6A1A]" aria-hidden />
            </div>
          </motion.div>

          <motion.h2
            {...fadeUpView(0.08, reduced)}
            id="projects-heading"
            className="enoteb-title enoteb-title--section enoteb-title--on-light mt-5"
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
                reduced={reduced}
              />
            </div>

            <div className="flex flex-col gap-5 lg:col-span-5 lg:gap-7">
              {displayProjects[1] ? (
                <ProjectShowcaseCard
                  project={displayProjects[1]}
                  index={1}
                  variant="compact"
                  reduced={reduced}
                />
              ) : null}

              {displayProjects[2] ? (
                <ProjectShowcaseCard
                  project={displayProjects[2]}
                  index={2}
                  variant="compact"
                  reduced={reduced}
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
