import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { getApiUrl } from './api';

const DEFAULT_SITE_URL = 'https://enoteb.ma';

export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.url ?? DEFAULT_SITE_URL;
  return url.replace(/\/$/, '');
}

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${getSiteUrl()}${normalized}`;
}

export function resolveSeoImageUrl(image?: string | null): string {
  if (!image) {
    return absoluteUrl('/opengraph-image');
  }

  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }

  if (image.startsWith('/uploads/')) {
    return `${getApiUrl()}${image}`;
  }

  return absoluteUrl(image);
}

export interface PageSeoInput {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  noIndex?: boolean;
}

export function createPageMetadata({
  title,
  description,
  path,
  image,
  noIndex = false,
}: PageSeoInput): Metadata {
  const url = absoluteUrl(path);
  const ogImage = resolveSeoImageUrl(image);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'website',
      locale: 'fr_FR',
      url,
      siteName: siteConfig.name,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    ...(noIndex
      ? {
          robots: {
            index: false,
            follow: false,
          },
        }
      : {}),
  };
}

export const defaultSiteDescription =
  'eNoteb conçoit et réalise des projets de construction, d’ingénierie industrielle, pharmaceutique et énergétique au Maroc — de la conception à la livraison clé en main.';
