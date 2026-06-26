import { PrismaService } from '../../prisma/prisma.service';
export declare class AdminService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getDashboard(): Promise<{
        projectCount: number;
        publishedCount: number;
        draftCount: number;
        unreadContactCount: number;
        bySector: {
            id: string;
            name: string;
            slug: string;
            projectCount: number;
        }[];
        recentProjects: {
            id: string;
            name: string;
            slug: string;
            isPublished: boolean;
            updatedAt: Date;
            sector: {
                id: string;
                name: string;
                slug: string;
            };
        }[];
    }>;
    listProjects(): Promise<{
        id: string;
        name: string;
        slug: string;
        location: string;
        isPublished: boolean;
        year: number | null;
        updatedAt: Date;
        createdAt: Date;
        sector: {
            id: string;
            name: string;
            slug: string;
        } | undefined;
    }[]>;
    getProjectById(id: string): Promise<{
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
        sector: {
            id: string;
            name: string;
            slug: string;
        } | undefined;
        photos: {
            id: string;
            url: string;
            altText: string;
            order: number;
        }[];
    }>;
    listContactRequests(filter?: 'all' | 'unread'): Promise<{
        items: {
            id: string;
            name: string;
            email: string;
            phone: string | null;
            company: string | null;
            message: string;
            isRead: boolean;
            createdAt: Date;
        }[];
        unreadCount: number;
    }>;
    getContactRequestById(id: string): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string | null;
        company: string | null;
        message: string;
        isRead: boolean;
        createdAt: Date;
    }>;
    markContactRequestRead(id: string, isRead: boolean): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string | null;
        company: string | null;
        message: string;
        isRead: boolean;
        createdAt: Date;
    }>;
    deleteContactRequest(id: string): Promise<void>;
    private serializeContactRequest;
    private serializeAdminListItem;
    private serializeAdminDetail;
}
