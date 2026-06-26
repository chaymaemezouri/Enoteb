import { getApiUrl } from './api';

/** Visuels de couverture par secteur — thématiques BTP / industrie. */
const INDUSTRIAL_BY_SECTOR: Record<string, string> = {
  construction:
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=85',
  amenagement:
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=85',
  industrie:
    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&q=85',
  pharmaceutique:
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85',
  'energie-renouvelable':
    'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=85',
};

const DEFAULT_INDUSTRIAL =
  'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=85';

export const DEFAULT_SECTOR_IMAGE = DEFAULT_INDUSTRIAL;

function isPlaceholderImage(url: string): boolean {
  return url.includes('picsum.photos');
}

function isAdminUpload(url: string): boolean {
  return url.startsWith('/uploads/');
}

/** Image catalogue pour la grille secteurs — ignore l’API (évite les mauvaises images admin). */
export function getSectorCatalogImage(sectorSlug: string): string {
  return INDUSTRIAL_BY_SECTOR[sectorSlug] ?? DEFAULT_INDUSTRIAL;
}

/** Image de couverture secteur : catalogue prioritaire, puis upload admin, puis URL API. */
export function resolveSectorCoverImage(
  url: string | null | undefined,
  sectorSlug?: string,
): string {
  if (sectorSlug && INDUSTRIAL_BY_SECTOR[sectorSlug]) {
    return INDUSTRIAL_BY_SECTOR[sectorSlug];
  }

  if (url && isAdminUpload(url)) {
    return resolveImageUrl(url);
  }

  if (url && !isPlaceholderImage(url)) {
    return resolveImageUrl(url);
  }

  return DEFAULT_INDUSTRIAL;
}

export function resolveIndustrialImage(
  url: string | null | undefined,
  sectorSlug?: string,
): string {
  return resolveSectorCoverImage(url, sectorSlug);
}

export function resolveImageUrl(url: string | null | undefined): string {
  if (!url) {
    return DEFAULT_INDUSTRIAL;
  }

  if (isPlaceholderImage(url)) {
    return DEFAULT_INDUSTRIAL;
  }

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  if (url.startsWith('/uploads/')) {
    return `${getApiUrl()}${url}`;
  }

  return url;
}

const THUMB_SUFFIX = '-thumb.webp';

export function resolveThumbnailUrl(url: string | null | undefined, sectorSlug?: string): string {
  if (url?.startsWith('/uploads/') && url.endsWith('.webp') && !url.includes('-thumb')) {
    const thumbUrl = url.replace(/\.webp$/, `${THUMB_SUFFIX}`);
    return `${getApiUrl()}${thumbUrl}`;
  }

  if (url?.startsWith('/uploads/')) {
    return resolveImageUrl(url);
  }

  return resolveSectorCoverImage(url, sectorSlug);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength).trimEnd()}…`;
}
