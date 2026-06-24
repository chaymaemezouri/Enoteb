import { getApiUrl } from './api';

/** Images industrielles / BTP — jamais de visuels lifestyle aléatoires (picsum). */
const INDUSTRIAL_BY_SECTOR: Record<string, string> = {
  construction:
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=85',
  amenagement:
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85',
  industrie:
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=85',
  pharmaceutique:
    'https://images.unsplash.com/photo-1579154204751-5661f58597a0?auto=format&fit=crop&w=1200&q=85',
  'energie-renouvelable':
    'https://images.unsplash.com/photo-1473341304170-f89fa6ea8405?auto=format&fit=crop&w=1200&q=85',
};

const DEFAULT_INDUSTRIAL =
  'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=85';

function isPlaceholderImage(url: string): boolean {
  return url.includes('picsum.photos');
}

export function resolveIndustrialImage(
  url: string | null | undefined,
  sectorSlug?: string,
): string {
  if (url && !isPlaceholderImage(url)) {
    return resolveImageUrl(url);
  }

  if (sectorSlug && INDUSTRIAL_BY_SECTOR[sectorSlug]) {
    return INDUSTRIAL_BY_SECTOR[sectorSlug];
  }

  return DEFAULT_INDUSTRIAL;
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
  if (!url || isPlaceholderImage(url)) {
    return resolveIndustrialImage(url, sectorSlug);
  }

  if (url.startsWith('/uploads/') && url.endsWith('.webp') && !url.includes('-thumb')) {
    const thumbUrl = url.replace(/\.webp$/, `${THUMB_SUFFIX}`);
    return `${getApiUrl()}${thumbUrl}`;
  }

  return resolveImageUrl(url);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength).trimEnd()}…`;
}
