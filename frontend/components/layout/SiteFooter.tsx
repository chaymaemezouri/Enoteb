'use client';

import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/cn';
import { FOOTER_SECTION_BG } from '@/lib/footer-theme';

const linkBase =
  'link-focus text-[0.8125rem] transition-colors duration-300 hover:text-[#FF6A1A] focus-visible:ring-[#FF6A1A]';

type FooterLink = { label: string; href: string };

function FooterLinks({ links }: { links: readonly FooterLink[] }) {
  return (
    <ul className="site-footer__links">
      {links.map((link) => (
        <li key={link.href}>
          <Link href={link.href} className={cn(linkBase, 'text-white/[0.56]')}>
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function SiteFooter({ className }: { className?: string }) {
  const year = new Date().getFullYear();
  const { footer, contact } = siteConfig;

  return (
    <footer
      className={cn('site-footer relative overflow-hidden border-t border-white/[0.06]', className)}
      style={{ backgroundColor: FOOTER_SECTION_BG }}
      data-hide-navbar-logo
    >
      <div className="site-footer__watermark-wrap" aria-hidden>
        <p className="site-footer__watermark">
          <span className="site-footer__watermark-text">{siteConfig.name}</span>
        </p>
      </div>

      <div className="site-footer__inner relative z-10 w-full px-5 pb-12 pt-10 sm:px-8 sm:pb-14 sm:pt-12 lg:px-[7%] lg:pb-16 lg:pt-14">
        <div className="pl-5 sm:pl-6">
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

            <div className="site-footer__col site-footer__contact">
              <p className="site-footer__label">{footer.contactTitle}</p>
              <address className="site-footer__contact-body not-italic">
                <p className="text-[0.8125rem] leading-relaxed text-white/[0.5]">{contact.address}</p>
                {contact.email ? (
                  <a
                    href={`mailto:${contact.email}`}
                    className={cn(linkBase, 'mt-2 inline-block text-white/[0.56]')}
                  >
                    {contact.email}
                  </a>
                ) : null}
              </address>
            </div>
          </div>

          <div className="site-footer__watermark-spacer" aria-hidden />

          <div className="site-footer__bottom">
            <span className="site-footer__rule" aria-hidden />
            <p className="site-footer__copyright">
              © {year} {siteConfig.name}. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
