"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let AdminService = class AdminService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboard() {
        const [projectCount, publishedCount, draftCount, unreadContactCount, sectors, recentProjects] = await Promise.all([
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
    async getProjectById(id) {
        const project = await this.prisma.project.findUnique({
            where: { id },
            include: {
                sector: { select: { id: true, name: true, slug: true } },
                photos: { orderBy: { order: 'asc' } },
            },
        });
        if (!project) {
            throw new common_1.NotFoundException('Projet introuvable');
        }
        return this.serializeAdminDetail(project);
    }
    async listContactRequests(filter = 'all') {
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
    async getContactRequestById(id) {
        const item = await this.prisma.contactRequest.findUnique({ where: { id } });
        if (!item) {
            throw new common_1.NotFoundException('Demande introuvable');
        }
        return this.serializeContactRequest(item);
    }
    async markContactRequestRead(id, isRead) {
        const item = await this.prisma.contactRequest.findUnique({ where: { id } });
        if (!item) {
            throw new common_1.NotFoundException('Demande introuvable');
        }
        const updated = await this.prisma.contactRequest.update({
            where: { id },
            data: { isRead },
        });
        return this.serializeContactRequest(updated);
    }
    async deleteContactRequest(id) {
        const item = await this.prisma.contactRequest.findUnique({ where: { id } });
        if (!item) {
            throw new common_1.NotFoundException('Demande introuvable');
        }
        await this.prisma.contactRequest.delete({ where: { id } });
    }
    serializeContactRequest(item) {
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
    serializeAdminListItem(project) {
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
    serializeAdminDetail(project) {
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
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map