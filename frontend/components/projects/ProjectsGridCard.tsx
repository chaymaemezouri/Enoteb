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
  'linear-gradient(180deg, rgba(8,15,25,0.08) 0%, rgba(8,15,25,0.42) 48%, rgba(8,15,25,0.94) 100%)';

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
    <div className="projects-grid-card__placeholder" aria-hidden>
      <div className="projects-grid-card__placeholder-grid" aria-hidden />
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
    <motion.article {...fadeUpView(delay, reduced)} className="projects-grid-card__wrap">
      <Link
        href={`/projets/${project.slug}`}
        aria-label={[project.name, meta, project.sector?.name].filter(Boolean).join(', ')}
        className="projects-grid-card card-link group"
      >
        <div className="projects-grid-card__media">
          {showPlaceholder ? (
            <ProjectImagePlaceholder />
          ) : (
            <Image
              src={imageSrc(project.mainImageUrl)}
              alt=""
              fill
              unoptimized={project.mainImageUrl.startsWith('/uploads/')}
              className="projects-grid-card__image"
              sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 25vw"
              onError={() => setFailed(true)}
            />
          )}

          <div className="projects-grid-card__overlay" style={{ background: OVERLAY }} aria-hidden />
          <div className="projects-grid-card__glow" aria-hidden />

          <span className="projects-grid-card__number" aria-hidden>
            {number}
          </span>

          <span className="projects-grid-card__corner projects-grid-card__corner--v" aria-hidden />
          <span className="projects-grid-card__corner projects-grid-card__corner--h" aria-hidden />

          <div className="projects-grid-card__body">
            {project.sector ? (
              <p className="projects-grid-card__sector">{project.sector.name}</p>
            ) : null}

            <h2 className="projects-grid-card__title">{project.name}</h2>

            {meta ? <p className="projects-grid-card__meta">{meta}</p> : null}

            <span className="projects-grid-card__cta">
              Voir
              <ArrowUpRight className="h-3 w-3" aria-hidden />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
