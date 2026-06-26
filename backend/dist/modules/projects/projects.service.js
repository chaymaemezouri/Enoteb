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
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const pagination_query_dto_1 = require("../../common/dto/pagination-query.dto");
const file_storage_service_1 = require("../../common/storage/file-storage.service");
const prisma_service_1 = require("../../prisma/prisma.service");
let ProjectsService = class ProjectsService {
    constructor(prisma, fileStorage) {
        this.prisma = prisma;
        this.fileStorage = fileStorage;
    }
    async findAll(query) {
        const { page, limit, skip } = (0, pagination_query_dto_1.resolvePagination)(query);
        const where = {
            isPublished: true,
            ...(query.sector && { sector: { slug: query.sector } }),
            ...(query.q?.trim() && {
                OR: [
                    { name: { contains: query.q.trim() } },
                    { location: { contains: query.q.trim() } },
                    { address: { contains: query.q.trim() } },
                    { client: { contains: query.q.trim() } },
                    { description: { contains: query.q.trim() } },
                ],
            }),
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
            meta: (0, pagination_query_dto_1.buildPaginationMeta)(total, page, limit),
        };
    }
    async findBySlug(slug) {
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
            throw new common_1.NotFoundException('Projet introuvable');
        }
        return this.serializeProject(project);
    }
    async create(dto) {
        await this.ensureSectorExists(dto.sectorId);
        await this.ensureSlugAvailable(dto.slug);
        const project = await this.prisma.project.create({
            data: {
                name: dto.name,
                slug: dto.slug,
                sectorId: dto.sectorId,
                client: dto.client,
                location: dto.location,
                address: dto.address,
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
    async update(id, dto) {
        const existing = await this.findByIdOrThrow(id);
        if (dto.sectorId) {
            await this.ensureSectorExists(dto.sectorId);
        }
        if (dto.slug) {
            await this.ensureSlugAvailable(dto.slug, id);
        }
        if (dto.mainImageUrl &&
            dto.mainImageUrl !== existing.mainImageUrl) {
            await this.fileStorage.deleteIfLocal(existing.mainImageUrl);
        }
        const project = await this.prisma.project.update({
            where: { id },
            data: {
                ...(dto.name !== undefined && { name: dto.name }),
                ...(dto.slug !== undefined && { slug: dto.slug }),
                ...(dto.sectorId !== undefined && { sectorId: dto.sectorId }),
                ...(dto.client !== undefined && { client: dto.client }),
                ...(dto.location !== undefined && { location: dto.location }),
                ...(dto.address !== undefined && { address: dto.address }),
                ...(dto.amount !== undefined && { amount: dto.amount }),
                ...(dto.showAmount !== undefined && { showAmount: dto.showAmount }),
                ...(dto.year !== undefined && { year: dto.year }),
                ...(dto.description !== undefined && { description: dto.description }),
                ...(dto.mainImageUrl !== undefined && { mainImageUrl: dto.mainImageUrl }),
                ...(dto.isPublished !== undefined && { isPublished: dto.isPublished }),
            },
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
    async remove(id) {
        const project = await this.prisma.project.findUnique({
            where: { id },
            include: { photos: true },
        });
        if (!project) {
            throw new common_1.NotFoundException('Projet introuvable');
        }
        await this.fileStorage.deleteIfLocal(project.mainImageUrl);
        await this.fileStorage.deleteManyIfLocal(project.photos.map((photo) => photo.url));
        await this.prisma.project.delete({ where: { id } });
    }
    async addPhoto(projectId, dto) {
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
    async removePhoto(projectId, photoId) {
        const photo = await this.prisma.projectPhoto.findFirst({
            where: { id: photoId, projectId },
        });
        if (!photo) {
            throw new common_1.NotFoundException('Photo introuvable');
        }
        await this.fileStorage.deleteIfLocal(photo.url);
        await this.prisma.projectPhoto.delete({ where: { id: photoId } });
    }
    async updatePhoto(projectId, photoId, dto) {
        await this.findByIdOrThrow(projectId);
        const photo = await this.prisma.projectPhoto.findFirst({
            where: { id: photoId, projectId },
        });
        if (!photo) {
            throw new common_1.NotFoundException('Photo introuvable');
        }
        return this.prisma.projectPhoto.update({
            where: { id: photoId },
            data: dto,
        });
    }
    async findByIdOrThrow(id) {
        const project = await this.prisma.project.findUnique({
            where: { id },
        });
        if (!project) {
            throw new common_1.NotFoundException('Projet introuvable');
        }
        return project;
    }
    async ensureSectorExists(sectorId) {
        const sector = await this.prisma.sector.findUnique({
            where: { id: sectorId },
        });
        if (!sector) {
            throw new common_1.NotFoundException('Secteur introuvable');
        }
    }
    async ensureSlugAvailable(slug, excludeId) {
        const existing = await this.prisma.project.findUnique({ where: { slug } });
        if (existing && existing.id !== excludeId) {
            throw new common_1.ConflictException('Ce slug est déjà utilisé');
        }
    }
    serializeProject(project) {
        return {
            id: project.id,
            name: project.name,
            slug: project.slug,
            sectorId: project.sectorId,
            client: project.client,
            location: project.location,
            address: project.address,
            amount: project.showAmount && project.amount !== null
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
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        file_storage_service_1.FileStorageService])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map