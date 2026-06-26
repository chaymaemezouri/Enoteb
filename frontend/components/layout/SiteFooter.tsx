'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FacebookIcon, LinkedinIcon } from '@/components/icons/SocialIcons';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/cn';
import { FOOTER_SECTION_BG } from '@/lib/footer-theme';

const linkBase =
  'site-footer__link link-focus text-[0.8125rem] text-white/[0.56] transition-colors duration-300 hover:text-[#F8F5EE] focus-visible:ring-[#FF6A1A]';

type FooterLink = { label: string; href: string };

function FooterLinks({ links }: { links: readonly FooterLink[] }) {
  return (
    <ul className="site-footer__links">
      {links.map((link) => (
        <li key={link.href}>
          <Link href={link.href} className={linkBase}>
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function FooterSocial({ className }: { className?: string }) {
  const { social } = siteConfig;

  if (!social.linkedin && !social.facebook) return null;

  return (
    <div className={cn('site-footer__social', className)}>
      {social.linkedin ? (
        <a
          href={social.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="site-footer__social-btn link-focus"
          aria-label="LinkedIn ENOTEB"
        >
          <LinkedinIcon className="h-4 w-4" />
        </a>
      ) : null}
      {social.facebook ? (
        <a
          href={social.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="site-footer__social-btn link-focus"
          aria-label="Facebook ENOTEB"
        >
          <FacebookIcon className="h-4 w-4" />
        </a>
      ) : null}
    </div>
  );
}

export function SiteFooter({
  className,
  variant = 'default',
}: {
  className?: string;
  variant?: 'default' | 'suite';
}) {
  const year = new Date().getFullYear();
  const { footer, logo, tagline } = siteConfig;

  return (
    <footer
      className={cn(
        'site-footer relative overflow-hidden',
        variant === 'default' && 'border-t border-white/[0.06]',
        variant === 'suite' && 'site-footer--suite',
        className,
      )}
      style={{ backgroundColor: FOOTER_SECTION_BG }}
      data-hide-navbar-logo
    >
      <div className="site-footer__watermark-wrap" aria-hidden>
        <p className="site-footer__watermark">
          <span className="site-footer__watermark-text">{siteConfig.name}</span>
        </p>
      </div>

      <div className="site-footer__inner home-shell relative z-10 w-full py-10 sm:py-11 lg:py-12">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <Link href="/" className="site-footer__brand-mark link-focus inline-flex">
              <Image
                src={logo.src}
                alt={siteConfig.name}
                width={120}
                height={48}
                className="h-9 w-auto object-contain opacity-90 sm:h-10"
              />
            </Link>
            <p className="site-footer__brand-tagline">{tagline}</p>
            <p className="site-footer__brand-about">{footer.about}</p>
            <FooterSocial className="mt-5" />
          </div>

          <div className="site-footer__main">
            <nav className="site-footer__col" aria-label="Services">
              <p className="site-footer__label">{footer.servicesTitle}</p>
              <FooterLinks links={footer.services} />
            </nav>

            <nav className="site-footer__col" aria-label={footer.companyTitle}>
              <p className="site-footer__label">{footer.companyTitle}</p>
              <FooterLinks links={footer.company} />
            </nav>

            <nav className="site-footer__col" aria-label={footer.legalTitle}>
              <p className="site-footer__label">{footer.legalTitle}</p>
              <FooterLinks links={footer.legal} />
            </nav>
          </div>
        </div>

        <div className="site-footer__bottom">
          <span className="site-footer__rule" aria-hidden />
          <div className="site-footer__bottom-row">
            <p className="site-footer__copyright">
              © {year} {siteConfig.name}. Tous droits réservés.
            </p>
            <FooterSocial className="site-footer__social--inline lg:hidden" />
          </div>
        </div>
      </div>
    </footer>
  );
}
