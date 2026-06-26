import type {
  ApiErrorBody,
  ContactPayload,
  ContactResponse,
  HealthResponse,
  PaginatedResponse,
  Project,
  ProjectSummary,
  Sector,
  SectorWithProjects,
} from '@/types';

const DEFAULT_API_URL = 'https://api.enoteb.ma';

function getApiUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL;
}

export class ApiClientError extends Error {
  readonly statusCode: number;
  readonly messages: string[];
  readonly path?: string;

  constructor(statusCode: number, messages: string[], path?: string) {
    super(messages.join(', '));
    this.name = 'ApiClientError';
    this.statusCode = statusCode;
    this.messages = messages;
    this.path = path;
  }
}

function normalizeMessages(message: ApiErrorBody['message']): string[] {
  if (Array.isArray(message)) {
    return message.map(String);
  }

  return [String(message)];
}

async function parseError(response: Response): Promise<ApiClientError> {
  let body: Partial<ApiErrorBody> = {};

  try {
    body = (await response.json()) as ApiErrorBody;
  } catch {
    body = { message: response.statusText };
  }

  return new ApiClientError(
    response.status,
    normalizeMessages(body.message ?? response.statusText),
    body.path,
  );
}

type RequestOptions = RequestInit & {
  revalidate?: number | false;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { revalidate, ...fetchOptions } = options;
  const headers = new Headers(fetchOptions.headers);

  if (fetchOptions.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${getApiUrl()}${path}`, {
    ...fetchOptions,
    headers,
    credentials: 'include',
    ...(revalidate === 0 ? { cache: 'no-store' as RequestCache } : {}),
    ...(revalidate !== undefined && revalidate !== 0
      ? { next: { revalidate: revalidate === false ? 0 : revalidate } }
      : {}),
  });

  if (!response.ok) {
    throw await parseError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

function withQuery(path: string, params?: Record<string, string | number | undefined>): string {
  if (!params) {
    return path;
  }

  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') {
      searchParams.set(key, String(value));
    }
  }

  const query = searchParams.toString();
  return query ? `${path}?${query}` : path;
}

export const api = {
  health: (options?: Pick<RequestOptions, 'revalidate'>) =>
    request<HealthResponse>('/health', options),

  getSectors: (options?: Pick<RequestOptions, 'revalidate'>) =>
    request<Sector[]>('/sectors', options),

  getSectorBySlug: (
    slug: string,
    params?: { page?: number; limit?: number },
    options?: Pick<RequestOptions, 'revalidate'>,
  ) => request<SectorWithProjects>(withQuery(`/sectors/${slug}`, params), options),

  getProjects: (
    params?: {
      sector?: string;
      page?: number;
      limit?: number;
      q?: string;
    },
    options?: Pick<RequestOptions, 'revalidate'>,
  ) => request<PaginatedResponse<ProjectSummary>>(withQuery('/projects', params), options),

  getProjectBySlug: (slug: string, options?: Pick<RequestOptions, 'revalidate'>) =>
    request<Project>(`/projects/${slug}`, options),

  sendContact: (payload: ContactPayload) =>
    request<ContactResponse>('/contact', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

export { getApiUrl };
