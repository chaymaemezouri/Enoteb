import { siteConfig } from '@/config/site';

/** Requête de recherche pour le siège ENOTEB (adresse complète). */
export function getOfficeMapsQuery(): string {
  return siteConfig.maps.locationQuery;
}

/** URL d’intégration Google Maps (géocodage par adresse). */
export function getGoogleMapsEmbedUrl(query = getOfficeMapsQuery(), zoom = siteConfig.maps.zoom): string {
  const params = new URLSearchParams({
    q: query,
    hl: 'fr',
    z: String(zoom),
    output: 'embed',
  });

  return `https://www.google.com/maps?${params.toString()}`;
}

/** Lien externe vers Google Maps. */
export function getGoogleMapsExternalUrl(query = getOfficeMapsQuery()): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
