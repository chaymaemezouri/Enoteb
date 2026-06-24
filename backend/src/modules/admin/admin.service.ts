import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard() {
    const [projectCount, sectors, recentProjects] = await Promise.all([
      this.prisma.project.count(),
      this.prisma.sector.findMany({
        orderBy: { order: 'asc' },
        include: {
          _count: { select: { projects: true } },
        },
      }),
      this.prisma.project.findMany({
        take: 5,
        orderBy: { updatedAt: 'desc' },
        include: {
          sector: { select: { id: true, name: true, slug: true } },
        },
      }),
    ]);

    return {
      projectCount,
      bySector: sectors.map((sector) => ({
        id: sector.id,
        name: sector.name,
        slug: sector.slug,
        projectCount: sector._count.projects,
      })),
      recentProjects: recentProjects.map((project) => ({
        id: project.id,
        name: project.name,
        slug: project.slug,
        isPublished: project.isPublished,
        updatedAt: project.updatedAt,
        sector: project.sector,
      })),
    };
  }

  async listProjects() {
    const projects = await this.prisma.project.findMany({
      orderBy: [{ updatedAt: 'desc' }],
      include: {
        sector: { select: { id: true, name: true, slug: true } },
      },
    });

    return projects.map((project) => this.serializeAdminListItem(project));
  }

  async getProjectById(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        sector: { select: { id: true, name: true, slug: true } },
        photos: { orderBy: { order: 'asc' } },
      },
    });

    if (!project) {
      throw new NotFoundException('Projet introuvable');
    }

    return this.serializeAdminDetail(project);
  }

  private serializeAdminListItem(project: {
    id: string;
    name: string;
    slug: string;
    location: string;
    isPublished: boolean;
    year: number | null;
    updatedAt: Date;
    createdAt: Date;
    sector?: { id: string; name: string; slug: string };
  }) {
    return {
      id: project.id,
      name: project.name,
      slug: project.slug,
      location: project.location,
      isPublished: project.isPublished,
      year: project.year,
      updatedAt: project.updatedAt,
      createdAt: project.createdAt,
      sector: project.sector,
    };
  }

  private serializeAdminDetail(project: {
    id: string;
    name: string;
    slug: string;
    sectorId: string;
    location: string;
    amount: { toString(): string } | null;
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
  }) {
    return {
      id: project.id,
      name: project.name,
      slug: project.slug,
      sectorId: project.sectorId,
      location: project.location,
      amount: project.amount !== null ? project.amount.toString() : null,
      showAmount: project.showAmount,
      year: project.year,
      description: project.description,
      mainImageUrl: project.mainImageUrl,
      isPublished: project.isPublished,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      sector: project.sector,
      photos: project.photos ?? [],
    };
  }
}
