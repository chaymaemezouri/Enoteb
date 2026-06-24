export interface ApiErrorBody {
  statusCode: number;
  message: string | string[];
  path?: string;
  timestamp?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface Sector {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface SectorWithProjects extends Sector {
  projects: PaginatedResponse<ProjectSummary>;
}

export interface ProjectSummary {
  id: string;
  name: string;
  slug: string;
  client: string | null;
  location: string;
  year: number | null;
  mainImageUrl: string;
  showAmount: boolean;
  amount: string | null;
  sector?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface ProjectPhoto {
  id: string;
  url: string;
  altText: string;
  order: number;
}

export interface Project extends ProjectSummary {
  sectorId: string;
  description: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  sector?: {
    id: string;
    name: string;
    slug: string;
  };
  photos?: ProjectPhoto[];
}

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  message: string;
  website?: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
}
