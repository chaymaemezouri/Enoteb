'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  ClipboardList,
  Compass,
  Factory,
  Layers,
  MapPin,
  PenLine,
  ShieldCheck,
  Sparkles,
  Wrench,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { projectsPageContent } from '@/config/projects';
import { formatAmount, formatYear } from '@/lib/format';
import { getProjectHighlights } from '@/lib/projectDetail';
import type { Project } from '@/types';
import { buildGalleryImages, ProjectDetailGallery } from './ProjectDetailGallery';

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
  const showAmount = project.showAmount && project.amount;
  const yearLabel = formatYear(project.year);
  const addressLine = project.address?.trim() || null;
  const mapQuery = addressLine || project.location;
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;

  const keyFigures = highlights.map((item) => ({
    icon: HIGHLIGHT_ICONS[item.icon] ?? Factory,
    label: item.title,
    value: item.description,
  }));

  const displayTitle = titleAccent ? `${titlePrimary} ${titleAccent}` : titlePrimary;

  const metaItems = [
    project.sector ? { label: detail.sectorLabel, value: project.sector.name } : null,
    project.client ? { label: detail.clientLabel, value: project.client } : null,
    yearLabel ? { label: detail.yearLabel, value: yearLabel } : null,
    { label: detail.locationLabel, value: project.location },
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  return (
    <div className="project-detail">
      <div className="project-detail__layout">
        <div className="project-detail__media">
          <ProjectDetailGallery
            images={galleryImages}
            projectName={project.name}
            sectorName={project.sector?.name}
          />
        </div>

        <div className="project-detail__panel">
          <header className="project-detail__head">
            <h1 className="project-detail__title">{displayTitle}</h1>

            <p className="project-detail__loc">
              <MapPin className="h-4 w-4 shrink-0" aria-hidden />
              <span>
                {project.location}
                {addressLine ? ` · ${addressLine}` : ''}
              </span>
            </p>
          </header>

          <div className="project-detail__divider" aria-hidden />

          <section className="project-detail__section">
            <h2 className="project-detail__label">{detail.aboutHeading}</h2>
            <p className="project-detail__text">{project.description}</p>
          </section>

          {showAmount ? (
            <section className="project-detail__amount" aria-labelledby="project-amount-label">
              <h2 id="project-amount-label" className="project-detail__label">
                {detail.amountLabel}
              </h2>
              <p className="project-detail__amount-value">{formatAmount(project.amount!)}</p>
            </section>
          ) : null}

          {metaItems.length > 0 ? (
            <dl className="project-detail__meta">
              {metaItems.map((item) => (
                <div key={item.label} className="project-detail__meta-item">
                  <dt className="project-detail__meta-label">{item.label}</dt>
                  <dd className="project-detail__meta-value">{item.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          {keyFigures.length > 0 ? (
            <section className="project-detail__section">
              <h2 className="project-detail__label">{detail.keyFiguresHeading}</h2>
              <ul className="project-detail__highlights">
                {keyFigures.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.label} className="project-detail__highlight">
                      <span className="project-detail__highlight-icon" aria-hidden>
                        <Icon className="h-4 w-4" strokeWidth={1.75} />
                      </span>
                      <div>
                        <p className="project-detail__highlight-title">{item.label}</p>
                        <p className="project-detail__highlight-text">{item.value}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}

          <footer className="project-detail__footer">
            <div className="project-detail__actions">
              <Link href="/contact" className="project-detail__btn project-detail__btn--primary">
                {detail.requestQuoteLabel}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-detail__btn project-detail__btn--secondary"
              >
                <MapPin className="h-4 w-4" aria-hidden />
                {detail.viewOnMapLabel}
              </a>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
