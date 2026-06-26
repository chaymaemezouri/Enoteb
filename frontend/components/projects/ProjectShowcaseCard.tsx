'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { getApiUrl } from '@/lib/api';
import { cn } from '@/lib/cn';
import type { ProjectSummary } from '@/types';
import { fadeUpView } from './projectsMotion';

const CINEMATIC_OVERLAY =
  'linear-gradient(180deg, rgba(8,15,25,0.18) 0%, rgba(8,15,25,0.52) 55%, rgba(8,15,25,0.9) 100%)';

export function hasValidProjectImage(url: string | null | undefined) {
  if (!url?.trim()) return false;
  return !url.includes('picsum.photos');
}

export function projectImageSrc(url: string) {
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/uploads/')) return `${getApiUrl()}${url}`;
  return url;
}

function sectorCategory(sector?: { name: string; slug: string }) {
  if (!sector?.name?.trim()) return 'Projet';
  return sector.name;
}

function formatLocationYear(
  location: string | null | undefined,
  year: number | null | undefined,
) {
  const parts = [location?.trim(), year ? String(year) : null].filter(Boolean);
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

export interface ProjectShowcaseCardProps {
  project: ProjectSummary;
  index: number;
  variant: 'featured' | 'compact' | 'standard';
  delay?: number;
}

export function ProjectShowcaseCard({
  project,
  index,
  variant,
  delay = 0,
}: ProjectShowcaseCardProps) {
  const reduced = useReducedMotion() ?? false;
  const isFeatured = variant === 'featured';
  const isStandard = variant === 'standard';
  const number = String(index + 1).padStart(2, '0');
  const locationYear = formatLocationYear(project.location, project.year);
  const ariaParts = [project.name, locationYear, sectorCategory(project.sector)].filter(Boolean);

  return (
    <motion.article {...fadeUpView(delay, reduced)} className="h-full">
      <Link
        href={`/projets/${project.slug}`}
        aria-label={ariaParts.join(', ')}
        className="project-showcase-card link-focus group relative flex h-full flex-col overflow-hidden rounded-none outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A1A] focus-visible:ring-offset-2"
      >
        <div
          className={cn(
            'relative w-full flex-1 overflow-hidden',
            isFeatured && 'min-h-[380px] sm:min-h-[440px] lg:min-h-[500px]',
            variant === 'compact' && 'min-h-[220px] sm:min-h-[248px] lg:min-h-[258px]',
            isStandard && 'min-h-[280px] sm:min-h-[300px]',
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
              isFeatured ? 'text-[4.5rem] lg:text-[5.5rem]' : 'text-[3.25rem] lg:text-[3.75rem]',
            )}
            aria-hidden
          >
            {number}
          </span>

          <span className="project-showcase-card__corner-v" aria-hidden />
          <span className="project-showcase-card__corner-h" aria-hidden />

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
                'project-showcase-card__title mt-2 leading-snug text-[#F8F5EE]',
                isFeatured
                  ? 'text-[clamp(1.25rem,2vw,1.625rem)]'
                  : 'text-[clamp(1rem,1.4vw,1.1875rem)]',
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

            <span className="project-showcase-card__cta mt-4 inline-flex w-fit items-center gap-1.5">
              Voir le projet
              <ArrowUpRight className="h-3 w-3" aria-hidden />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
