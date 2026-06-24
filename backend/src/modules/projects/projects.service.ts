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
import { AddProjectPhotoDto } from './dto/add-project-photo.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { ListProjectsQueryDto } from './dto/list-projects-query.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UpdateProjectPhotoDto } from './dto/update-project-photo.dto';

type SerializedProject = {
  id: string;
  name: string;
  slug: string;
  sectorId: string;
  client: string | null;
  location: string;
  amount: string | null;
  showAmount: boolean;
  year: number | null;
  description: string;
  mainImageUrl: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  sector?: {
    id: string;
    name: string;
    slug: string;
  };
  photos?: Array<{
    id: string;
    url: string;
    altText: string;
    order: number;
  }>;
};

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileStorage: FileStorageService,
  ) {}

  async findAll(
    query: ListProjectsQueryDto,
  ): Promise<PaginatedResult<SerializedProject>> {
    const { page, limit, skip } = resolvePagination(query);

    const where: Prisma.ProjectWhereInput = {
      isPublished: true,
      ...(query.sector && { sector: { slug: query.sector } }),
    };

    const [projects, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        orderBy: [{ year: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
        include: {
          sector: {
            select: { id: true, name: true, slug: true },
          },
        },
      }),
      this.prisma.project.count({ where }),
    ]);

    return {
      data: projects.map((project) => this.serializeProject(project)),
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async findBySlug(slug: string): Promise<SerializedProject> {
    const project = await this.prisma.project.findFirst({
      where: { slug, isPublished: true },
      include: {
        sector: {
          select: { id: true, name: true, slug: true },
        },
        photos: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Projet introuvable');
    }

    return this.serializeProject(project);
  }

  async create(dto: CreateProjectDto) {
    await this.ensureSectorExists(dto.sectorId);
    await this.ensureSlugAvailable(dto.slug);

    const project = await this.prisma.project.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        sectorId: dto.sectorId,
        client: dto.client,
        location: dto.location,
        amount: dto.amount,
        showAmount: dto.showAmount ?? false,
        year: dto.year,
        description: dto.description,
        mainImageUrl: dto.mainImageUrl,
        isPublished: dto.isPublished ?? true,
      },
      include: {
        sector: {
          select: { id: true, name: true, slug: true },
        },
        photos: true,
      },
    });

    return this.serializeProject(project);
  }

  async update(id: string, dto: UpdateProjectDto) {
    const existing = await this.findByIdOrThrow(id);

    if (dto.sectorId) {
      await this.ensureSectorExists(dto.sectorId);
    }

    if (dto.slug) {
      await this.ensureSlugAvailable(dto.slug, id);
    }

    if (
      dto.mainImageUrl &&
      dto.mainImageUrl !== existing.mainImageUrl
    ) {
      await this.fileStorage.deleteIfLocal(existing.mainImageUrl);
    }

    const project = await this.prisma.project.update({
      where: { id },
      data: dto,
      include: {
        sector: {
          select: { id: true, name: true, slug: true },
        },
        photos: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return this.serializeProject(project);
  }

  async remove(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: { photos: true },
    });

    if (!project) {
      throw new NotFoundException('Projet introuvable');
    }

    await this.fileStorage.deleteIfLocal(project.mainImageUrl);
    await this.fileStorage.deleteManyIfLocal(
      project.photos.map((photo) => photo.url),
    );

    await this.prisma.project.delete({ where: { id } });
  }

  async addPhoto(projectId: string, dto: AddProjectPhotoDto) {
    await this.findByIdOrThrow(projectId);

    const photo = await this.prisma.projectPhoto.create({
      data: {
        projectId,
        url: dto.url,
        altText: dto.altText,
        order: dto.order,
      },
    });

    return photo;
  }

  async removePhoto(projectId: string, photoId: string) {
    const photo = await this.prisma.projectPhoto.findFirst({
      where: { id: photoId, projectId },
    });

    if (!photo) {
      throw new NotFoundException('Photo introuvable');
    }

    await this.fileStorage.deleteIfLocal(photo.url);
    await this.prisma.projectPhoto.delete({ where: { id: photoId } });
  }

  async updatePhoto(
    projectId: string,
    photoId: string,
    dto: UpdateProjectPhotoDto,
  ) {
    await this.findByIdOrThrow(projectId);

    const photo = await this.prisma.projectPhoto.findFirst({
      where: { id: photoId, projectId },
    });

    if (!photo) {
      throw new NotFoundException('Photo introuvable');
    }

    return this.prisma.projectPhoto.update({
      where: { id: photoId },
      data: dto,
    });
  }

  private async findByIdOrThrow(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException('Projet introuvable');
    }

    return project;
  }

  private async ensureSectorExists(sectorId: string) {
    const sector = await this.prisma.sector.findUnique({
      where: { id: sectorId },
    });

    if (!sector) {
      throw new NotFoundException('Secteur introuvable');
    }
  }

  private async ensureSlugAvailable(slug: string, excludeId?: string) {
    const existing = await this.prisma.project.findUnique({ where: { slug } });

    if (existing && existing.id !== excludeId) {
      throw new ConflictException('Ce slug est déjà utilisé');
    }
  }

  private serializeProject(project: {
    id: string;
    name: string;
    slug: string;
    sectorId: string;
    client: string | null;
    location: string;
    amount: Prisma.Decimal | null;
    showAmount: boolean;
    year: number | null;
    description: string;
    mainImageUrl: string;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
    sector?: { id: string; name: string; slug: string };
    photos?: Array<{
      id: string;
      url: string;
      altText: string;
      order: number;
    }>;
  }): SerializedProject {
    return {
      id: project.id,
      name: project.name,
      slug: project.slug,
      sectorId: project.sectorId,
      client: project.client,
      location: project.location,
      amount:
        project.showAmount && project.amount !== null
          ? project.amount.toString()
          : null,
      showAmount: project.showAmount,
      year: project.year,
      description: project.description,
      mainImageUrl: project.mainImageUrl,
      isPublished: project.isPublished,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      sector: project.sector,
      photos: project.photos,
    };
  }
}
