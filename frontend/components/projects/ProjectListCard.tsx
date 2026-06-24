import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Card } from '@/components/ui/Card';
import { formatAmount } from '@/lib/format';
import { resolveThumbnailUrl } from '@/lib/utils';
import type { ProjectSummary } from '@/types';

const CARD_IMAGE_WIDTH = 640;
const CARD_IMAGE_HEIGHT = 400;

interface ProjectListCardProps {
  project: ProjectSummary;
}

export function ProjectListCard({ project }: ProjectListCardProps) {
  const showAmount = project.showAmount && project.amount;

  return (
    <Card padding="none" variant="default" className="flex h-full flex-col overflow-hidden">
      <div className="overflow-hidden bg-neutral-100">
        <Image
          src={resolveThumbnailUrl(project.mainImageUrl, project.sector?.slug)}
          alt={`Photo principale du projet ${project.name} à ${project.location}`}
          width={CARD_IMAGE_WIDTH}
          height={CARD_IMAGE_HEIGHT}
          className="aspect-[16/10] h-auto w-full object-cover transition-transform duration-300 motion-safe:hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        {project.sector ? (
          <Badge variant="neutral" className="mb-3 w-fit">
            {project.sector.name}
          </Badge>
        ) : null}

        <h2 className="text-h3 text-neutral-900">{project.name}</h2>

        <p className="mt-2 flex items-center gap-1.5 text-body-sm text-neutral-500">
          <MapPin className="h-4 w-4 shrink-0" aria-hidden />
          {project.location}
        </p>

        {showAmount ? (
          <p className="mt-3 text-subtitle font-semibold text-accent">
            {formatAmount(project.amount!)}
          </p>
        ) : null}

        <div className="mt-auto pt-5">
          <ButtonLink
            href={`/projets/${project.slug}`}
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
          >
            Voir le projet
          </ButtonLink>
        </div>
      </div>
    </Card>
  );
}
