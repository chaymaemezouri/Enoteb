import { PaginatedResult } from '../../common/dto/pagination-query.dto';
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
    address: string | null;
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
export declare class ProjectsService {
    private readonly prisma;
    private readonly fileStorage;
    constructor(prisma: PrismaService, fileStorage: FileStorageService);
    findAll(query: ListProjectsQueryDto): Promise<PaginatedResult<SerializedProject>>;
    findBySlug(slug: string): Promise<SerializedProject>;
    create(dto: CreateProjectDto): Promise<SerializedProject>;
    update(id: string, dto: UpdateProjectDto): Promise<SerializedProject>;
    remove(id: string): Promise<void>;
    addPhoto(projectId: string, dto: AddProjectPhotoDto): Promise<{
        url: string;
        id: string;
        altText: string;
        order: number;
        projectId: string;
    }>;
    removePhoto(projectId: string, photoId: string): Promise<void>;
    updatePhoto(projectId: string, photoId: string, dto: UpdateProjectPhotoDto): Promise<{
        url: string;
        id: string;
        altText: string;
        order: number;
        projectId: string;
    }>;
    private findByIdOrThrow;
    private ensureSectorExists;
    private ensureSlugAvailable;
    private serializeProject;
}
export {};
