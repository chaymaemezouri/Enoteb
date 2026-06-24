import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  buildPaginationMeta,
  PaginatedResult,
  resolvePagination,
} from '../../common/dto/pagination-query.dto';
import { FileStorageService } from '../../common/storage/file-storage.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSectorDto } from './dto/create-sector.dto';
import { SectorProjectsQueryDto } from './dto/sector-projects-query.dto';
import { UpdateSectorDto } from './dto/update-sector.dto';

type ProjectSummary = {
  id: string;
  name: string;
  slug: string;
  location: string;
  year: number | null;
  mainImageUrl: string;
  showAmount: boolean;
  amount: string | null;
};

@Injectable()
export class SectorsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileStorage: FileStorageService,
  ) {}

  findAll() {
    return this.prisma.sector.findMany({
      orderBy: { order: 'asc' },
    });
  }

  async findBySlugWithProjects(
    slug: string,
    query: SectorProjectsQueryDto,
  ): Promise<{
    id: string;
    name: string;
    slug: string;
    description: string;
    imageUrl: string | null;
    order: number;
    createdAt: Date;
    updatedAt: Date;
    projects: PaginatedResult<ProjectSummary>;
  }> {
    const sector = await this.prisma.sector.findUnique({
      where: { slug },
    });

    if (!sector) {
      throw new NotFoundException('Secteur introuvable');
    }

    const { page, limit, skip } = resolvePagination(query);

    const where: Prisma.ProjectWhereInput = {
      sectorId: sector.id,
      isPublished: true,
    };

    const [projects, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        orderBy: [{ year: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          location: true,
          year: true,
          mainImageUrl: true,
          showAmount: true,
          amount: true,
        },
      }),
      this.prisma.project.count({ where }),
    ]);

    return {
      ...sector,
      projects: {
        data: projects.map((project) => this.serializeProjectSummary(project)),
        meta: buildPaginationMeta(total, page, limit),
      },
    };
  }

  async create(dto: CreateSectorDto) {
    await this.ensureSlugAvailable(dto.slug);

    return this.prisma.sector.create({
      data: dto,
    });
  }

  async update(id: string, dto: UpdateSectorDto) {
    const existing = await this.findByIdOrThrow(id);

    if (dto.slug) {
      await this.ensureSlugAvailable(dto.slug, id);
    }

    if (dto.imageUrl && dto.imageUrl !== existing.imageUrl) {
      await this.fileStorage.deleteIfLocal(existing.imageUrl);
    }

    return this.prisma.sector.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    const sector = await this.findByIdOrThrow(id);

    const projectCount = await this.prisma.project.count({
      where: { sectorId: id },
    });

    if (projectCount > 0) {
      throw new ConflictException(
        'Impossible de supprimer un secteur qui contient encore des projets',
      );
    }

    await this.fileStorage.deleteIfLocal(sector.imageUrl);

    return this.prisma.sector.delete({
      where: { id },
    });
  }

  private async findByIdOrThrow(id: string) {
    const sector = await this.prisma.sector.findUnique({ where: { id } });

    if (!sector) {
      throw new NotFoundException('Secteur introuvable');
    }

    return sector;
  }

  private async ensureSlugAvailable(slug: string, excludeId?: string) {
    const existing = await this.prisma.sector.findUnique({ where: { slug } });

    if (existing && existing.id !== excludeId) {
      throw new ConflictException('Ce slug est déjà utilisé');
    }
  }

  private serializeProjectSummary(project: {
    id: string;
    name: string;
    slug: string;
    location: string;
    year: number | null;
    mainImageUrl: string;
    showAmount: boolean;
    amount: Prisma.Decimal | null;
  }): ProjectSummary {
    return {
      ...project,
      amount:
        project.showAmount && project.amount !== null
          ? project.amount.toString()
          : null,
    };
  }
}
