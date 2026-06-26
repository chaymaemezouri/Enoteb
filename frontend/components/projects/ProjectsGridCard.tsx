'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { getApiUrl } from '@/lib/api';
import type { ProjectSummary } from '@/types';
import { fadeUpView } from './projectsMotion';

const OVERLAY =
  'linear-gradient(180deg, rgba(8,15,25,0.12) 0%, rgba(8,15,25,0.45) 52%, rgba(8,15,25,0.92) 100%)';

interface ProjectsGridCardProps {
  project: ProjectSummary;
  index: number;
  delay?: number;
}

function hasValidImage(url: string | null | undefined) {
  if (!url?.trim()) return false;
  return !url.includes('picsum.photos');
}

function imageSrc(url: string) {
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/uploads/')) return `${getApiUrl()}${url}`;
  return url;
}

function formatMeta(project: ProjectSummary) {
  const parts = [project.location?.trim(), project.year ? String(project.year) : null].filter(
    Boolean,
  );
  return parts.length ? parts.join(' · ') : null;
}

function ProjectImagePlaceholder() {
  return (
    <div
      className="absolute inset-0 bg-[linear-gradient(145deg,#0B1117_0%,#121a24_48%,#0D131A_100%)]"
      aria-hidden
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.028)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.028)_1px,transparent_1px)] bg-[size:44px_44px] opacity-40"
        aria-hidden
      />
    </div>
  );
}

export function ProjectsGridCard({ project, index, delay = 0 }: ProjectsGridCardProps) {
  const reduced = useReducedMotion() ?? false;
  const valid = hasValidImage(project.mainImageUrl);
  const [failed, setFailed] = useState(false);
  const showPlaceholder = !valid || failed;
  const meta = formatMeta(project);
  const number = String(index + 1).padStart(2, '0');

  useEffect(() => {
    setFailed(false);
  }, [project.id, project.mainImageUrl]);

  return (
    <motion.article {...fadeUpView(delay, reduced)} className="h-full">
      <Link
        href={`/projets/${project.slug}`}
        aria-label={[project.name, meta, project.sector?.name].filter(Boolean).join(', ')}
        className="projects-grid-card card-link group relative flex h-full min-h-[300px] flex-col overflow-hidden border border-[#18212B]/14 bg-[#08111A] shadow-[0_16px_40px_-18px_rgba(24,33,43,0.45)] transition-[border-color,box-shadow,transform] duration-500 hover:-translate-y-0.5 hover:border-[#FF6A1A]/32 hover:shadow-[0_22px_48px_-16px_rgba(24,33,43,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A1A]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F6F2EA]"
      >
        <div className="relative min-h-[300px] flex-1 overflow-hidden">
          {showPlaceholder ? (
            <ProjectImagePlaceholder />
          ) : (
            <Image
              src={imageSrc(project.mainImageUrl)}
              alt=""
              fill
              unoptimized={project.mainImageUrl.startsWith('/uploads/')}
              className="object-cover transition-transform duration-[700ms] ease-out group-hover:scale-[1.05]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              onError={() => setFailed(true)}
            />
          )}

          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-500 group-hover:opacity-95"
            style={{ background: OVERLAY }}
            aria-hidden
          />

          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(255,106,26,0.12), transparent 70%)',
            }}
            aria-hidden
          />

          <span
            className="pointer-events-none absolute right-2.5 top-2.5 select-none font-sans text-[2.75rem] font-bold leading-none tracking-[-0.05em] text-white/[0.07] sm:text-[3.25rem]"
            aria-hidden
          >
            {number}
          </span>

          <span className="projects-grid-card__corner projects-grid-card__corner--v" aria-hidden />
          <span className="projects-grid-card__corner projects-grid-card__corner--h" aria-hidden />

          <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col p-4 sm:p-5">
            {project.sector ? (
              <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.2em] text-[#FF6A1A]">
                {project.sector.name}
              </p>
            ) : null}

            <h2 className="mt-2 line-clamp-2 text-[0.9375rem] font-bold leading-snug tracking-[-0.02em] text-[#F8F5EE] sm:text-base">
              {project.name}
            </h2>

            {meta ? (
              <p className="mt-1.5 line-clamp-1 text-[0.6875rem] text-[rgba(248,245,238,0.62)] sm:text-xs">
                {meta}
              </p>
            ) : null}

            <span className="projects-grid-card__cta mt-3 inline-flex w-fit items-center gap-1 border border-white/15 bg-white/[0.05] px-2.5 py-1.5 text-[0.5625rem] font-semibold uppercase tracking-[0.12em] text-[#F8F5EE] backdrop-blur-sm transition-[border-color,color,background-color,gap] duration-300 group-hover:border-[#FF6A1A]/45 group-hover:bg-[#FF6A1A]/10 group-hover:text-[#FF6A1A] group-hover:gap-1.5">
              Voir
              <ArrowUpRight className="h-3 w-3" aria-hidden />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
