import { CreateSectorDto } from './dto/create-sector.dto';
import { SectorProjectsQueryDto } from './dto/sector-projects-query.dto';
import { UpdateSectorDto } from './dto/update-sector.dto';
import { SectorsService } from './sectors.service';
export declare class SectorsController {
    private readonly sectorsService;
    constructor(sectorsService: SectorsService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        order: number;
        slug: string;
        description: string;
        imageUrl: string | null;
    }[]>;
    findBySlug(slug: string, query: SectorProjectsQueryDto): Promise<{
        id: string;
        name: string;
        slug: string;
        description: string;
        imageUrl: string | null;
        order: number;
        createdAt: Date;
        updatedAt: Date;
        projects: import("../../common/dto/pagination-query.dto").PaginatedResult<{
            id: string;
            name: string;
            slug: string;
            location: string;
            year: number | null;
            mainImageUrl: string;
            showAmount: boolean;
            amount: string | null;
        }>;
    }>;
    create(dto: CreateSectorDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        order: number;
        slug: string;
        description: string;
        imageUrl: string | null;
    }>;
    update(id: string, dto: UpdateSectorDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        order: number;
        slug: string;
        description: string;
        imageUrl: string | null;
    }>;
    remove(id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        order: number;
        slug: string;
        description: string;
        imageUrl: string | null;
    }>;
}
