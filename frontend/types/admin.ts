export interface AuthLoginResponse {
  accessToken: string;
}

export interface AdminDashboard {
  projectCount: number;
  bySector: Array<{
    id: string;
    name: string;
    slug: string;
    projectCount: number;
  }>;
  recentProjects: Array<{
    id: string;
    name: string;
    slug: string;
    isPublished: boolean;
    updatedAt: string;
    sector?: { id: string; name: string; slug: string };
  }>;
}

export interface AdminProjectListItem {
  id: string;
  name: string;
  slug: string;
  location: string;
  isPublished: boolean;
  year: number | null;
  updatedAt: string;
  createdAt: string;
  sector?: { id: string; name: string; slug: string };
}

export interface AdminProjectDetail {
  id: string;
  name: string;
  slug: string;
  sectorId: string;
  client: string | null;
  location: string;
  amount: string | null;
  showAmount: boolean;
  year: number | null;
  description: string;
  mainImageUrl: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  sector?: { id: string; name: string; slug: string };
  photos: Array<{
    id: string;
    url: string;
    altText: string;
    order: number;
  }>;
}

export interface ProjectWritePayload {
  name: string;
  slug: string;
  sectorId: string;
  location: string;
  client?: string;
  amount?: number;
  showAmount?: boolean;
  year?: number;
  description: string;
  mainImageUrl: string;
  isPublished?: boolean;
}

export interface SectorUpdatePayload {
  name?: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
  order?: number;
}
