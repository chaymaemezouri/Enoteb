import { Prisma } from '@prisma/client';
import { PaginatedResult } from '../../common/dto/pagination-query.dto';
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
export declare class SectorsService {
    private readonly prisma;
    private readonly fileStorage;
    constructor(prisma: PrismaService, fileStorage: FileStorageService);
    findAll(): Prisma.PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        order: number;
        slug: string;
        description: string;
        imageUrl: string | null;
    }[]>;
    findBySlugWithProjects(slug: string, query: SectorProjectsQueryDto): Promise<{
        id: string;
        name: string;
        slug: string;
        description: string;
        imageUrl: string | null;
        order: number;
        createdAt: Date;
        updatedAt: Date;
        projects: PaginatedResult<ProjectSummary>;
    }>;
    create(dto: CreateSectorDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        order: number;
        slug: string;
        description: string;
        imageUrl: string | null;
    }>;
    update(id: string, dto: UpdateSectorDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        order: number;
        slug: string;
        description: string;
        imageUrl: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        order: number;
        slug: string;
        description: string;
        imageUrl: string | null;
    }>;
    private findByIdOrThrow;
    private ensureSlugAvailable;
    private serializeProjectSummary;
}
export {};
