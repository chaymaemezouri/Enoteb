import { projectsPageContent } from '@/config/projects';

export function splitProjectTitle(name: string): { primary: string; accent: string } {
  const trimmed = name.trim();
  const dashSplit = trimmed.split(/\s[—–-]\s/);

  if (dashSplit.length >= 2) {
    return {
      primary: dashSplit[0].trim(),
      accent: dashSplit.slice(1).join(' - ').trim(),
    };
  }

  const words = trimmed.split(/\s+/);

  if (words.length <= 2) {
    return {
      primary: words[0] ?? trimmed,
      accent: words.slice(1).join(' '),
    };
  }

  const splitAt = Math.max(2, Math.ceil(words.length * 0.45));

  return {
    primary: words.slice(0, splitAt).join(' '),
    accent: words.slice(splitAt).join(' '),
  };
}

type Highlight = {
  title: string;
  description: string;
  icon: string;
};

export function getProjectHighlights(sectorSlug?: string): readonly Highlight[] {
  const { highlightsBySector, defaultHighlights } = projectsPageContent.detail;

  if (sectorSlug && sectorSlug in highlightsBySector) {
    return highlightsBySector[sectorSlug as keyof typeof highlightsBySector];
  }

  return defaultHighlights;
}
