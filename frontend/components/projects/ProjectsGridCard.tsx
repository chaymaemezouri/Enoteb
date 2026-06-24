'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { getApiUrl } from '@/lib/api';
import type { ProjectSummary } from '@/types';
import { fadeUpView } from './projectsMotion';

interface ProjectsGridCardProps {
  project: ProjectSummary;
  delay?: number;
  featured?: boolean;
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

export function ProjectsGridCard({ project, delay = 0, featured = false }: ProjectsGridCardProps) {
  const reduced = useReducedMotion() ?? false;
  const valid = hasValidImage(project.mainImageUrl);
  const [failed, setFailed] = useState(false);
  const showPlaceholder = !valid || failed;

  useEffect(() => {
    setFailed(false);
  }, [project.id, project.mainImageUrl]);

  return (
    <motion.article
      {...fadeUpView(delay, reduced)}
      className={`group relative overflow-hidden ${
        featured ? 'min-h-[320px] md:col-span-2 md:min-h-[360px]' : 'min-h-[280px] sm:min-h-[300px]'
      }`}
    >
      <Link
        href={`/projets/${project.slug}`}
        className="link-focus absolute inset-0 z-10 focus-visible:ring-2 focus-visible:ring-[#FF6B1A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F2EC]"
        aria-label={`${project.name} — voir le projet`}
      >
        <span className="sr-only">{project.name}</span>
      </Link>

      {showPlaceholder ? (
        <div
          className="absolute inset-0 bg-[linear-gradient(145deg,#0B1117_0%,#121a24_48%,#0D131A_100%)]"
          aria-hidden
        />
      ) : (
        <Image
          src={imageSrc(project.mainImageUrl)}
          alt=""
          fill
          unoptimized={project.mainImageUrl.startsWith('/uploads/')}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          sizes={featured ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 100vw, 33vw'}
          onError={() => setFailed(true)}
        />
      )}

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#111820]/96 via-[#111820]/48 to-[#111820]/12"
        aria-hidden
      />

      <div className="absolute inset-x-0 bottom-0 z-[1] p-5 sm:p-6">
        {project.sector ? (
          <p className="text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-[#FF6B1A]">
            {project.sector.name}
          </p>
        ) : null}
        <h2
          className={`mt-2 font-bold leading-tight tracking-[-0.02em] text-white ${
            featured
              ? 'text-[clamp(1.25rem,2.2vw,1.75rem)]'
              : 'text-[clamp(1.0625rem,1.6vw,1.375rem)]'
          }`}
        >
          {project.name}
        </h2>
        <p className="mt-2 flex items-center gap-1.5 text-[0.8125rem] text-white/58">
          <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {project.location}
        </p>
        <span className="mt-3 inline-flex items-center gap-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[#FF6B1A] transition-transform duration-300 group-hover:gap-2.5">
          Voir le projet
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
        </span>
      </div>
    </motion.article>
  );
}
