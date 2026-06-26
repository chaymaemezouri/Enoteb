import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { resolveThumbnailUrl } from '@/lib/utils';
import type { ProjectSummary } from '@/types';
import { cn } from '@/lib/cn';

interface ProjectCardProps {
  project: ProjectSummary;
  variant?: 'default' | 'showcase';
  index?: number;
}

export function ProjectCard({ project, variant = 'default', index = 0 }: ProjectCardProps) {
  const isShowcase = variant === 'showcase';

  return (
    <Link href={`/projets/${project.slug}`} className="card-link group block h-full">
      <article
        className={cn(
          'relative h-full overflow-hidden bg-[#52565e] shadow-[0_24px_56px_-20px_rgb(72_76_84_/_0.3)] ring-1 ring-white/[0.08] transition-all duration-500 hover:shadow-[0_32px_64px_-18px_rgb(72_76_84_/_0.35)] hover:ring-[#F36A21]/25',
          isShowcase ? 'min-h-[420px] lg:min-h-[480px]' : 'min-h-[320px]',
        )}
      >
        <Image
          src={resolveThumbnailUrl(project.mainImageUrl, project.sector?.slug)}
          alt={`Réalisation ${project.name} — ${project.location}`}
          fill
          className="object-cover opacity-90 transition-transform duration-[1.4s] ease-out group-hover:scale-[1.04]"
          sizes={isShowcase ? '(max-width: 1024px) 100vw, 58vw' : '(max-width: 768px) 100vw, 33vw'}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#52565e] via-[#52565e]/55 to-[#52565e]/10" />
        <div
          className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10"
          aria-hidden
        />

        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-6 sm:p-7">
          <span className="font-sans text-[3rem] font-light leading-none text-white/15 sm:text-[3.5rem]">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="flex h-11 w-11 items-center justify-center border border-white/20 bg-white/5 text-white backdrop-blur-sm transition-all duration-300 group-hover:border-[#F36A21] group-hover:bg-[#F36A21]">
            <ArrowUpRight className="h-5 w-5" aria-hidden />
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
          {project.sector ? (
            <p className="text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-[#F36A21]">
              {project.sector.name}
            </p>
          ) : null}
          <h3
            className={cn(
              'mt-2 font-bold tracking-[-0.02em] text-[#f7f5f0] transition-colors group-hover:text-white',
              isShowcase ? 'text-2xl sm:text-3xl' : 'text-xl',
            )}
          >
            {project.name}
          </h3>
          {project.client ? <p className="mt-1 text-sm text-white/50">{project.client}</p> : null}
          <p className="mt-3 flex items-center gap-1.5 text-sm text-white/40">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {project.location}
          </p>
        </div>
      </article>
    </Link>
  );
}
