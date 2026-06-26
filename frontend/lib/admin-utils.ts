import { getApiUrl } from './api';

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function formatAdminError(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message.trim();

    if (message.includes('Identifiants invalides')) {
      return 'Email ou mot de passe incorrect.';
    }

    if (message.includes('déjà utilisée') || message.includes('already')) {
      return 'Cette adresse email est déjà utilisée.';
    }

    if (message.includes('Failed to fetch') || message.includes('NetworkError')) {
      return 'Connexion au serveur impossible. Vérifiez votre réseau.';
    }

    return message || 'Une erreur est survenue. Veuillez réessayer.';
  }

  return 'Une erreur est survenue. Veuillez réessayer.';
}

export function formatAdminDate(value: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function resolveAdminAvatarUrl(url: string | null | undefined): string | null {
  if (!url) {
    return null;
  }

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  if (url.startsWith('/uploads/')) {
    return `${getApiUrl()}${url}`;
  }

  return url;
}

export async function uploadImage(file: File, accessToken: string): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${getApiUrl()}/upload/image`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: 'include',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Le téléversement de l’image a échoué.');
  }

  const data = (await response.json()) as { url: string };
  return data.url;
}
