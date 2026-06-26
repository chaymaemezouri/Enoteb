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
exports.SectorsService = void 0;
const common_1 = require("@nestjs/common");
const pagination_query_dto_1 = require("../../common/dto/pagination-query.dto");
const file_storage_service_1 = require("../../common/storage/file-storage.service");
const prisma_service_1 = require("../../prisma/prisma.service");
let SectorsService = class SectorsService {
    constructor(prisma, fileStorage) {
        this.prisma = prisma;
        this.fileStorage = fileStorage;
    }
    findAll() {
        return this.prisma.sector.findMany({
            orderBy: { order: 'asc' },
        });
    }
    async findBySlugWithProjects(slug, query) {
        const sector = await this.prisma.sector.findUnique({
            where: { slug },
        });
        if (!sector) {
            throw new common_1.NotFoundException('Secteur introuvable');
        }
        const { page, limit, skip } = (0, pagination_query_dto_1.resolvePagination)(query);
        const where = {
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
                meta: (0, pagination_query_dto_1.buildPaginationMeta)(total, page, limit),
            },
        };
    }
    async create(dto) {
        await this.ensureSlugAvailable(dto.slug);
        return this.prisma.sector.create({
            data: dto,
        });
    }
    async update(id, dto) {
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
    async remove(id) {
        const sector = await this.findByIdOrThrow(id);
        const projectCount = await this.prisma.project.count({
            where: { sectorId: id },
        });
        if (projectCount > 0) {
            throw new common_1.ConflictException('Impossible de supprimer un secteur qui contient encore des projets');
        }
        await this.fileStorage.deleteIfLocal(sector.imageUrl);
        return this.prisma.sector.delete({
            where: { id },
        });
    }
    async findByIdOrThrow(id) {
        const sector = await this.prisma.sector.findUnique({ where: { id } });
        if (!sector) {
            throw new common_1.NotFoundException('Secteur introuvable');
        }
        return sector;
    }
    async ensureSlugAvailable(slug, excludeId) {
        const existing = await this.prisma.sector.findUnique({ where: { slug } });
        if (existing && existing.id !== excludeId) {
            throw new common_1.ConflictException('Ce slug est déjà utilisé');
        }
    }
    serializeProjectSummary(project) {
        return {
            ...project,
            amount: project.showAmount && project.amount !== null
                ? project.amount.toString()
                : null,
        };
    }
};
exports.SectorsService = SectorsService;
exports.SectorsService = SectorsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        file_storage_service_1.FileStorageService])
], SectorsService);
//# sourceMappingURL=sectors.service.js.map