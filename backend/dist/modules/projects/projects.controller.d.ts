import { AddProjectPhotoDto } from './dto/add-project-photo.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { ListProjectsQueryDto } from './dto/list-projects-query.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UpdateProjectPhotoDto } from './dto/update-project-photo.dto';
import { ProjectsService } from './projects.service';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    findAll(query: ListProjectsQueryDto): Promise<import("../../common/dto/pagination-query.dto").PaginatedResult<{
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
    }>>;
    findBySlug(slug: string): Promise<{
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
    }>;
    create(dto: CreateProjectDto): Promise<{
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
    }>;
    update(id: string, dto: UpdateProjectDto): Promise<{
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
    }>;
    remove(id: string): Promise<void>;
    addPhoto(id: string, dto: AddProjectPhotoDto): Promise<{
        url: string;
        id: string;
        altText: string;
        order: number;
        projectId: string;
    }>;
    removePhoto(id: string, photoId: string): Promise<void>;
    updatePhoto(id: string, photoId: string, dto: UpdateProjectPhotoDto): Promise<{
        url: string;
        id: string;
        altText: string;
        order: number;
        projectId: string;
    }>;
}
