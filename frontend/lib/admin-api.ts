import { ApiClientError, getApiUrl } from './api';
import type {
  AdminDashboard,
  AdminProjectDetail,
  AdminProjectListItem,
  ProjectWritePayload,
  SectorUpdatePayload,
} from '@/types/admin';
import type { ProjectPhoto, Sector } from '@/types';

let accessTokenGetter: () => string | null = () => null;

export function setAccessTokenGetter(getter: () => string | null): void {
  accessTokenGetter = getter;
}

async function authFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = accessTokenGetter();
  const headers = new Headers(options.headers);

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${getApiUrl()}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    let message = 'Une erreur est survenue.';

    try {
      const body = (await response.json()) as {
        message?: string | string[];
      };
      if (Array.isArray(body.message)) {
        message = body.message.join(', ');
      } else if (body.message) {
        message = body.message;
      }
    } catch {
      message = response.statusText;
    }

    throw new ApiClientError(response.status, [message]);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const adminApi = {
  getDashboard: () => authFetch<AdminDashboard>('/admin/dashboard'),

  listProjects: () => authFetch<AdminProjectListItem[]>('/admin/projects'),

  getProject: (id: string) => authFetch<AdminProjectDetail>(`/admin/projects/${id}`),

  createProject: (payload: ProjectWritePayload) =>
    authFetch<AdminProjectDetail>('/projects', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateProject: (id: string, payload: Partial<ProjectWritePayload>) =>
    authFetch<AdminProjectDetail>(`/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  deleteProject: (id: string) => authFetch<void>(`/projects/${id}`, { method: 'DELETE' }),

  addPhoto: (projectId: string, payload: { url: string; altText: string; order: number }) =>
    authFetch<ProjectPhoto>(`/projects/${projectId}/photos`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updatePhoto: (
    projectId: string,
    photoId: string,
    payload: { altText?: string; order?: number },
  ) =>
    authFetch<ProjectPhoto>(`/projects/${projectId}/photos/${photoId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  deletePhoto: (projectId: string, photoId: string) =>
    authFetch<void>(`/projects/${projectId}/photos/${photoId}`, {
      method: 'DELETE',
    }),

  getSectors: () => authFetch<Sector[]>('/sectors'),

  updateSector: (id: string, payload: SectorUpdatePayload) =>
    authFetch<Sector>(`/sectors/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
};
