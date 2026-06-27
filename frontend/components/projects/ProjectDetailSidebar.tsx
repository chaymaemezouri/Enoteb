'use client';

import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { projectsPageContent } from '@/config/projects';
import { formatAmount, formatYear } from '@/lib/format';
import type { Project } from '@/types';

interface ProjectDetailSidebarProps {
  project: Project;
}

export function ProjectDetailSidebar({ project }: ProjectDetailSidebarProps) {
  const { detail } = projectsPageContent;
  const showAmount = project.showAmount && project.amount;
  const yearLabel = formatYear(project.year);

  return (
    <aside className="project-detail-sidebar">
      <div className="project-detail-sidebar__sheet">
        <h2 className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-[#252A30]">
          {detail.technicalSheetTitle}
        </h2>

        <dl className="mt-5 space-y-4">
          {project.sector ? (
            <div>
              <dt className="text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-[#6B7078]">
                {detail.sectorLabel}
              </dt>
              <dd className="mt-1 text-sm font-medium text-[#252A30]">{project.sector.name}</dd>
            </div>
          ) : null}

          <div>
            <dt className="text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-[#6B7078]">
              {detail.locationLabel}
            </dt>
            <dd className="mt-1 flex items-center gap-2 text-sm font-medium text-[#252A30]">
              <MapPin className="h-4 w-4 shrink-0 text-[#FF6B1A]" aria-hidden />
              {project.location}
            </dd>
          </div>

          {showAmount ? (
            <div>
              <dt className="text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-[#6B7078]">
                {detail.amountLabel}
              </dt>
              <dd className="mt-1 text-sm font-semibold text-[#252A30]">
                {formatAmount(project.amount!)}
              </dd>
            </div>
          ) : null}

          {yearLabel ? (
            <div>
              <dt className="text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-[#6B7078]">
                {detail.yearLabel}
              </dt>
              <dd className="mt-1 text-sm font-medium text-[#252A30]">{yearLabel}</dd>
            </div>
          ) : null}

          {project.client ? (
            <div>
              <dt className="text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-[#6B7078]">
                {detail.clientLabel}
              </dt>
              <dd className="mt-1 text-sm font-medium text-[#252A30]">{project.client}</dd>
            </div>
          ) : null}

          <div>
            <dt className="text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-[#6B7078]">
              {detail.statusLabel}
            </dt>
            <dd className="mt-2">
              <span className="inline-flex bg-[#1F8A4C] px-2.5 py-1 text-[0.625rem] font-bold uppercase tracking-[0.12em] text-white">
                {detail.statusDelivered}
              </span>
            </dd>
          </div>
        </dl>
      </div>

      <div className="project-detail-sidebar__actions">
        <Link
          href="/contact"
          className="link-focus flex w-full items-center justify-center bg-[#111820] px-4 py-3.5 text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#0B1117] focus-visible:ring-[#FF6B1A]"
        >
          {detail.contactExpertLabel}
        </Link>
      </div>

      <div className="project-detail-sidebar__map">
        <MapPin className="h-8 w-8 text-[#6B7078]/45" aria-hidden />
        <p className="mt-3 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-[#6B7078]">
          {detail.mapLabel}
        </p>
        <p className="mt-1 px-4 text-xs text-[#6B7078]/80">{project.location}</p>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(project.location + ', Maroc')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="link-focus mt-3 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[#FF6B1A] hover:underline"
        >
          Ouvrir dans Maps
        </a>
      </div>
    </aside>
  );
}
