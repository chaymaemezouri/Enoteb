import { siteConfig } from '@/config/site';

export function getWhatsAppUrl(message?: string): string | null {
  const number = siteConfig.whatsapp.number.replace(/\D/g, '');
  if (!number) {
    return null;
  }

  const url = new URL(`https://wa.me/${number}`);
  url.searchParams.set('text', message ?? siteConfig.whatsapp.defaultMessage);
  return url.toString();
}

export function getPhoneTelHref(phone: string): string {
  return `tel:${phone.replace(/\s/g, '')}`;
}
