'use client';

import { ChevronDown, Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, type Ref } from 'react';
import { siteConfig } from '@/config/site';
import { useHeaderTheme } from '@/hooks/useHeaderTheme';
import { cn } from '@/lib/cn';

const TOP_NAV = siteConfig.nav.slice(3);
const DROPDOWN_NAV = siteConfig.nav.slice(1, 3);
const CONTACT_HREF = '/contact';

function isNavActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname.startsWith(href);
}

function NavLink({
  href,
  label,
  pathname,
  onClick,
  linkRef,
}: {
  href: string;
  label: string;
  pathname: string;
  onClick?: () => void;
  linkRef?: Ref<HTMLAnchorElement>;
}) {
  const isActive = isNavActive(pathname, href);

  return (
    <Link
      ref={linkRef}
      href={href}
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      className="link-focus nav-link whitespace-nowrap"
    >
      {label}
    </Link>
  );
}

function NavCta({
  href,
  label,
  pathname,
  onClick,
  variant,
}: {
  href: string;
  label: string;
  pathname: string;
  onClick?: () => void;
  variant: 'hero' | 'light';
}) {
  const isActive = isNavActive(pathname, href);

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'nav-cta link-focus rounded-none inline-flex items-center justify-center',
        variant === 'hero' ? 'btn-orange-glass' : 'nav-cta--light',
      )}
    >
      {label}
    </Link>
  );
}

function NavDropdown({
  pathname,
  variant,
  className,
}: {
  pathname: string;
  variant: 'hero' | 'light';
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        className="link-focus nav-link"
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls="navbar-dropdown-menu"
        onClick={() => setOpen((value) => !value)}
      >
        À propos
        <ChevronDown
          className={cn('h-3 w-3 opacity-70 transition-transform duration-200', open && 'rotate-180')}
          aria-hidden
        />
      </button>

      {open ? (
        <div
          id="navbar-dropdown-menu"
          role="menu"
          className={cn(
            'navbar-dropdown__panel',
            variant === 'hero' ? 'navbar-dropdown__panel--dark' : 'navbar-dropdown__panel--light',
          )}
        >
          {DROPDOWN_NAV.map((item) => {
            const itemActive = isNavActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                aria-current={itemActive ? 'page' : undefined}
                className="navbar-dropdown__item link-focus"
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function BrandLogo({ variant }: { variant: 'hero' | 'light' }) {
  return (
    <Link
      href="/"
      className="link-focus flex shrink-0 items-center"
      aria-label={`${siteConfig.name} — Accueil`}
    >
      <Image
        src={siteConfig.logo.src}
        alt=""
        width={156}
        height={52}
        className={cn(
          'site-navbar__brand-logo',
          variant === 'light' && 'site-navbar__brand-logo--light',
        )}
        priority
      />
      <span className="sr-only">{siteConfig.name}</span>
    </Link>
  );
}

function getNavShellClass(showNavGlass: boolean, navVariant: 'hero' | 'light') {
  if (!showNavGlass) {
    return 'navbar-shell';
  }

  return cn(
    'navbar-shell navbar-shell--glass',
    navVariant === 'light' ? 'navbar-shell--glass-light' : 'navbar-shell--glass-dark',
  );
}

function renderNavItems(pathname: string, variant: 'hero' | 'light') {
  return (
    <>
      <NavDropdown pathname={pathname} variant={variant} />
      {TOP_NAV.map((item) =>
        item.href === CONTACT_HREF ? (
          <NavCta
            key={item.href}
            href={item.href}
            label={item.label}
            pathname={pathname}
            variant={variant}
          />
        ) : (
          <NavLink key={item.href} href={item.href} label={item.label} pathname={pathname} />
        ),
      )}
    </>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isCinematicPage =
    pathname === '/' ||
    pathname === '/qui-sommes-nous' ||
    pathname === '/secteurs' ||
    pathname === '/projets' ||
    pathname === '/contact';
  const { theme: headerTheme, scrolled, hideLogo } = useHeaderTheme(isCinematicPage);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [compactNav, setCompactNav] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const navSizerRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);

  const navOnDark = isCinematicPage ? headerTheme !== 'light' : false;
  const navVariant: 'hero' | 'light' = navOnDark ? 'hero' : 'light';
  const showNavGlass = isCinematicPage && (scrolled || headerTheme === 'light');

  const evaluateNavMode = useCallback(() => {
    const row = rowRef.current;
    const brand = brandRef.current;
    const sizer = navSizerRef.current;
    if (!row || !brand || !sizer) return;

    const available = row.clientWidth - brand.offsetWidth - 48 - 16;
    setCompactNav(sizer.offsetWidth > available);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');

    function updateViewport() {
      setIsMobile(media.matches);
    }

    updateViewport();
    media.addEventListener('change', updateViewport);
    return () => media.removeEventListener('change', updateViewport);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      firstMobileLinkRef.current?.focus();
    }
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (menuContainerRef.current && !menuContainerRef.current.contains(event.target as Node)) {
        setMobileOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closeMobileMenu();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [mobileOpen, closeMobileMenu]);

  useEffect(() => {
    evaluateNavMode();

    const row = rowRef.current;
    const sizer = navSizerRef.current;
    const brand = brandRef.current;
    if (!row || !sizer || !brand) return;

    const observer = new ResizeObserver(() => evaluateNavMode());
    observer.observe(row);
    observer.observe(sizer);
    observer.observe(brand);
    window.addEventListener('resize', evaluateNavMode);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', evaluateNavMode);
    };
  }, [evaluateNavMode, showNavGlass, pathname, navVariant]);

  const showHamburger = scrolled || compactNav || hideLogo;
  const showMenuButton = showHamburger && (!hideLogo || isMobile);
  const hideNavChromeDesktop = hideLogo && !isMobile;

  return (
    <header
      className={cn(
        'site-navbar',
        navOnDark ? 'site-navbar--dark' : 'site-navbar--light',
        scrolled && 'site-navbar--scrolled',
        isHome && 'lg:px-10',
        !isHome && 'lg:pl-[calc(3.5rem+1.5rem)] lg:pr-14 xl:pl-[calc(4rem+2rem)]',
        hideNavChromeDesktop && 'md:pointer-events-none md:invisible md:opacity-0',
      )}
      data-nav-theme={navOnDark ? 'dark' : 'light'}
    >
      <div className="site-navbar__backdrop" aria-hidden />

      <div
        ref={rowRef}
        className={cn('site-navbar__inner', hideLogo ? 'justify-end' : 'justify-between')}
      >
        {!hideLogo ? (
          <div ref={brandRef} className="site-navbar__brand">
            <BrandLogo variant={navVariant} />
          </div>
        ) : (
          <div ref={brandRef} className="sr-only" aria-hidden />
        )}

        <div className="site-navbar__actions">
          <div
            ref={navSizerRef}
            className={cn(
              'pointer-events-none absolute -left-[9999px] top-0 flex h-0 overflow-hidden opacity-0',
              getNavShellClass(showNavGlass, navVariant),
            )}
            aria-hidden
          >
            {renderNavItems(pathname, navVariant)}
          </div>

          {!showHamburger ? (
            <nav
              className={getNavShellClass(showNavGlass, navVariant)}
              aria-label="Navigation principale"
            >
              {renderNavItems(pathname, navVariant)}
            </nav>
          ) : null}

          {showMenuButton ? (
            <div ref={menuContainerRef} className="relative">
              <button
                ref={menuButtonRef}
                type="button"
                className={cn(
                  'navbar-menu-btn link-focus',
                  navVariant === 'light' && 'navbar-menu-btn--light',
                )}
                aria-expanded={mobileOpen}
                aria-controls="navbar-mobile-menu"
                aria-haspopup="true"
                aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                onClick={() => setMobileOpen((open) => !open)}
              >
                {mobileOpen ? (
                  <X className="h-[1.125rem] w-[1.125rem]" aria-hidden />
                ) : (
                  <Menu className="h-[1.125rem] w-[1.125rem]" aria-hidden />
                )}
              </button>

              {mobileOpen ? (
                <div
                  id="navbar-mobile-menu"
                  role="menu"
                  className={cn(
                    'navbar-mobile-panel',
                    navVariant === 'hero' ? 'navbar-mobile-panel--dark' : 'navbar-mobile-panel--light',
                  )}
                >
                  <nav aria-label="Navigation mobile">
                    {siteConfig.nav.map((item, index) => (
                      <Link
                        key={item.href}
                        ref={index === 0 ? firstMobileLinkRef : undefined}
                        href={item.href}
                        role="menuitem"
                        onClick={closeMobileMenu}
                        aria-current={isNavActive(pathname, item.href) ? 'page' : undefined}
                        className="navbar-mobile-panel__item link-focus"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
