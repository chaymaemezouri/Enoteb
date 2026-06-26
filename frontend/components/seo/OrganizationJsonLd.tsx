import { siteConfig } from '@/config/site';
import { getActiveSocialLinks } from '@/lib/social';
import { absoluteUrl, getSiteUrl } from '@/lib/seo';
import { JsonLd } from './JsonLd';

export function OrganizationJsonLd() {
  const socialLinks = getActiveSocialLinks().map((link) => link.href);

  const data = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: siteConfig.name,
    description: siteConfig.seo.defaultDescription,
    url: getSiteUrl(),
    logo: absoluteUrl(siteConfig.seo.logoPath),
    image: absoluteUrl('/opengraph-image'),
    email: siteConfig.contact.email,
    telephone: siteConfig.contact.phone.replace(/\s/g, ''),
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.contact.addressLines[0],
      addressLocality: siteConfig.contact.addressLines[1],
      addressCountry: siteConfig.contact.addressLines[2],
    },
    areaServed: {
      '@type': 'Country',
      name: 'Maroc',
    },
    ...(socialLinks.length > 0 ? { sameAs: socialLinks } : {}),
  };

  return <JsonLd id="organization-jsonld" data={data} />;
}
