export interface ProjectsUrlParams {
  sector?: string;
  page?: number;
  q?: string;
}

export function buildProjectsUrl({ sector, page, q }: ProjectsUrlParams = {}): string {
  const params = new URLSearchParams();
  const trimmedQuery = q?.trim();

  if (sector) {
    params.set('sector', sector);
  }

  if (trimmedQuery) {
    params.set('q', trimmedQuery);
  }

  if (page && page > 1) {
    params.set('page', String(page));
  }

  const query = params.toString();
  return query ? `/projets?${query}` : '/projets';
}
