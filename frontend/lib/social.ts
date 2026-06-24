import { siteConfig } from '@/config/site';

export interface SocialLink {
  id: keyof typeof siteConfig.social;
  label: string;
  href: string;
}

const SOCIAL_LABELS: Record<keyof typeof siteConfig.social, string> = {
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
};

function isValidSocialUrl(url: string | undefined | null): url is string {
  if (!url || url.trim() === '' || url === '#') {
    return false;
  }

  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

export function getActiveSocialLinks(): SocialLink[] {
  return (Object.keys(siteConfig.social) as Array<keyof typeof siteConfig.social>)
    .filter((id) => isValidSocialUrl(siteConfig.social[id]))
    .map((id) => ({
      id,
      label: SOCIAL_LABELS[id],
      href: siteConfig.social[id],
    }));
}
