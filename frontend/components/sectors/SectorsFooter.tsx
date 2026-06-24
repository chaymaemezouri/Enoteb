'use client';

import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import { sectorsPageContent } from '@/config/sectors';
import { siteConfig } from '@/config/site';
import { FacebookIcon, LinkedinIcon } from '@/components/icons/SocialIcons';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/cn';
import { SECTORS_CONTAINER } from './sectorsMotion';

const linkClass =
  'link-focus text-sm text-white/[0.62] transition-colors duration-300 hover:text-[#FF6B1A] focus-visible:ring-[#FF6B1A]';

interface SectorsFooterProps {
  sectorNames: string[];
}

export function SectorsFooter({ sectorNames }: SectorsFooterProps) {
  const { footer } = sectorsPageContent;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t-4 border-[#FF6B1A] bg-[#111820]" data-header-theme="dark">
      <Container fluid className={`py-12 sm:py-14 ${SECTORS_CONTAINER}`}>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="text-lg font-bold tracking-tight text-[#F5F1EA]">{siteConfig.name}</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/[0.55]">
              {footer.about}
            </p>
            <div className="mt-5 flex items-center gap-3">
              {siteConfig.social.linkedin ? (
                <a
                  href={siteConfig.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(linkClass, 'text-white/[0.45]')}
                  aria-label="LinkedIn ENOTEB"
                >
                  <LinkedinIcon className="h-4 w-4" />
                </a>
              ) : null}
              {siteConfig.social.facebook ? (
                <a
                  href={siteConfig.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(linkClass, 'text-white/[0.45]')}
                  aria-label="Facebook ENOTEB"
                >
                  <FacebookIcon className="h-4 w-4" />
                </a>
              ) : null}
            </div>
          </div>

          <div>
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-[#FF6B1A]">
              {footer.servicesTitle}
            </p>
            <ul className="mt-4 space-y-2.5">
              {sectorNames.map((name) => (
                <li key={name} className="text-sm text-white/[0.62]">
                  {name}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-[#FF6B1A]">
              {footer.companyTitle}
            </p>
            <ul className="mt-4 space-y-2.5">
              {footer.companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-[#FF6B1A]">
              {footer.contactTitle}
            </p>
            <ul className="mt-4 space-y-3.5">
              <li className="flex items-start gap-2.5 text-sm text-white/[0.62]">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#FF6B1A]" aria-hidden />
                <span>{siteConfig.contact.address}</span>
              </li>
              {siteConfig.contact.phone ? (
                <li>
                  <a
                    href={`tel:${siteConfig.contact.phone}`}
                    className={cn(linkClass, 'inline-flex items-center gap-2.5')}
                  >
                    <Phone className="h-4 w-4 shrink-0 text-[#FF6B1A]" aria-hidden />
                    {siteConfig.contact.phone}
                  </a>
                </li>
              ) : null}
              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className={cn(linkClass, 'inline-flex items-center gap-2.5')}
                >
                  <Mail className="h-4 w-4 shrink-0 text-[#FF6B1A]" aria-hidden />
                  {siteConfig.contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/[0.08] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-white/[0.42]">
            © {year} {siteConfig.name}. Tous droits réservés.
          </p>
          <div className="flex flex-wrap gap-4">
            {siteConfig.social.linkedin ? (
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                LinkedIn
              </a>
            ) : null}
            {siteConfig.social.facebook ? (
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Facebook
              </a>
            ) : null}
          </div>
        </div>
      </Container>
    </footer>
  );
}
