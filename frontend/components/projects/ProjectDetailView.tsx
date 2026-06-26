'use client';

import {
  Building2,
  ClipboardList,
  Compass,
  Factory,
  Layers,
  PenLine,
  ShieldCheck,
  Sparkles,
  Wrench,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { projectsPageContent } from '@/config/projects';
import { getProjectHighlights } from '@/lib/projectDetail';
import type { Project } from '@/types';
import { buildGalleryImages, ProjectDetailGallery } from './ProjectDetailGallery';
import { ProjectDetailSidebar } from './ProjectDetailSidebar';

const HIGHLIGHT_ICONS: Record<string, LucideIcon> = {
  building: Building2,
  layers: Layers,
  compass: Compass,
  sparkles: Sparkles,
  beam: Factory,
  pipe: PenLine,
  shield: ShieldCheck,
  clipboard: ClipboardList,
  zap: Zap,
  wrench: Wrench,
};

interface ProjectDetailViewProps {
  project: Project;
  titlePrimary: string;
  titleAccent: string;
}

export function ProjectDetailView({ project, titlePrimary, titleAccent }: ProjectDetailViewProps) {
  const { detail } = projectsPageContent;
  const galleryImages = buildGalleryImages(project.mainImageUrl, project.photos, project.name);
  const highlights = getProjectHighlights(project.sector?.slug);

  return (
    <div>
      <header className="max-w-4xl">
        <h1 className="font-sans text-[clamp(1.75rem,4vw,2.75rem)] font-bold uppercase leading-[1.05] tracking-[-0.02em] text-[#252A30]">
          {titlePrimary}
          {titleAccent ? <span className="mt-1 block text-[#FF6B1A]">{titleAccent}</span> : null}
        </h1>
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.65fr)_minmax(280px,380px)] lg:gap-12">
        <div>
          <ProjectDetailGallery images={galleryImages} projectName={project.name} />

          <section className="mt-10">
            <div className="flex items-center gap-3">
              <span className="h-6 w-px shrink-0 bg-[#FF6B1A]" aria-hidden />
              <h2 className="text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-[#252A30]">
                {detail.descriptionHeading}
              </h2>
            </div>
            <div className="mt-5 whitespace-pre-line text-[0.9375rem] leading-[1.75] text-[#6B7078]">
              {project.description}
            </div>
          </section>

          <section className="mt-10 grid gap-6 sm:grid-cols-2">
            {highlights.map((item) => {
              const Icon = HIGHLIGHT_ICONS[item.icon] ?? Factory;
              return (
                <div key={item.title} className="flex gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center text-[#FF6B1A]">
                    <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-[#252A30]">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-[#6B7078]">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </section>
        </div>

        <ProjectDetailSidebar project={project} />
      </div>
    </div>
  );
}
