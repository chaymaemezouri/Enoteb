export declare class CreateProjectDto {
    name: string;
    slug: string;
    sectorId: string;
    location: string;
    address?: string | null;
    client?: string;
    amount?: number;
    showAmount?: boolean;
    year?: number;
    description: string;
    mainImageUrl: string;
    isPublished?: boolean;
}
