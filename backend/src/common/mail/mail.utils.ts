const PLACEHOLDER_SMTP_HOSTS = new Set(['smtp.example.com', 'example.com', 'localhost']);

export interface SmtpConfig {
  host?: string;
  port?: number;
  user?: string;
  pass?: string;
}

export function isSmtpConfigured(smtp: SmtpConfig | undefined): boolean {
  const host = smtp?.host?.trim().toLowerCase() ?? '';
  const user = smtp?.user?.trim() ?? '';
  const pass = smtp?.pass?.trim() ?? '';
  const port = smtp?.port;

  if (!host || !user || !pass || !port || Number.isNaN(port)) {
    return false;
  }

  if (PLACEHOLDER_SMTP_HOSTS.has(host)) {
    return false;
  }

  if (pass === 'change-me' || user.includes('example.com')) {
    return false;
  }

  return true;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function formatFrenchDateTime(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'full',
    timeStyle: 'medium',
    timeZone: 'Africa/Casablanca',
  }).format(date);
}
