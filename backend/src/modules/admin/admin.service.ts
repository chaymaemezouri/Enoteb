import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard() {
    const [projectCount, publishedCount, draftCount, unreadContactCount, sectors, recentProjects] =
      await Promise.all([
      this.prisma.project.count(),
      this.prisma.project.count({ where: { isPublished: true } }),
      this.prisma.project.count({ where: { isPublished: false } }),
      this.prisma.contactRequest.count({ where: { isRead: false } }),
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
      publishedCount,
      draftCount,
      unreadContactCount,
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

  async listContactRequests(filter: 'all' | 'unread' = 'all') {
    const where = filter === 'unread' ? { isRead: false } : undefined;

    const [items, unreadCount] = await Promise.all([
      this.prisma.contactRequest.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.contactRequest.count({ where: { isRead: false } }),
    ]);

    return {
      items: items.map((item) => this.serializeContactRequest(item)),
      unreadCount,
    };
  }

  async getContactRequestById(id: string) {
    const item = await this.prisma.contactRequest.findUnique({ where: { id } });

    if (!item) {
      throw new NotFoundException('Demande introuvable');
    }

    return this.serializeContactRequest(item);
  }

  async markContactRequestRead(id: string, isRead: boolean) {
    const item = await this.prisma.contactRequest.findUnique({ where: { id } });

    if (!item) {
      throw new NotFoundException('Demande introuvable');
    }

    const updated = await this.prisma.contactRequest.update({
      where: { id },
      data: { isRead },
    });

    return this.serializeContactRequest(updated);
  }

  async deleteContactRequest(id: string) {
    const item = await this.prisma.contactRequest.findUnique({ where: { id } });

    if (!item) {
      throw new NotFoundException('Demande introuvable');
    }

    await this.prisma.contactRequest.delete({ where: { id } });
  }

  private serializeContactRequest(item: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    company: string | null;
    message: string;
    isRead: boolean;
    createdAt: Date;
  }) {
    return {
      id: item.id,
      name: item.name,
      email: item.email,
      phone: item.phone,
      company: item.company,
      message: item.message,
      isRead: item.isRead,
      createdAt: item.createdAt,
    };
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
    client: string | null;
    location: string;
    address: string | null;
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
      client: project.client,
      location: project.location,
      address: project.address,
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
