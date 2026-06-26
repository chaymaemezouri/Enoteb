'use client';

import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, type Ref } from 'react';
import { siteConfig } from '@/config/site';
import { useHeaderTheme } from '@/hooks/useHeaderTheme';
import { cn } from '@/lib/cn';

const MAIN_NAV = siteConfig.nav.filter((item) => item.href !== '/');
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
}: {
  href: string;
  label: string;
  pathname: string;
  onClick?: () => void;
}) {
  const isActive = isNavActive(pathname, href);

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'nav-cta link-focus rounded-none inline-flex items-center justify-center btn-orange-solid',
      )}
    >
      {label}
    </Link>
  );
}

function renderMobileBarItems(pathname: string, variant: 'hero' | 'light') {
  return MAIN_NAV.map((item) =>
    item.href === CONTACT_HREF ? (
      <NavCta
        key={item.href}
        href={item.href}
        label={item.label}
        pathname={pathname}
      />
    ) : (
      <NavLink key={item.href} href={item.href} label={item.label} pathname={pathname} />
    ),
  );
}

function renderNavItems(pathname: string, variant: 'hero' | 'light') {
  return MAIN_NAV.map((item) =>
    item.href === CONTACT_HREF ? (
      <NavCta
        key={item.href}
        href={item.href}
        label={item.label}
        pathname={pathname}
      />
    ) : (
      <NavLink key={item.href} href={item.href} label={item.label} pathname={pathname} />
    ),
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

function getNavShellClass(
  navVariant: 'hero' | 'light',
  options: { scrolled: boolean; showNavGlass: boolean; mobileBar?: boolean },
) {
  const { scrolled, showNavGlass, mobileBar } = options;

  if (scrolled) {
    return cn(
      'navbar-shell navbar-shell--solid',
      navVariant === 'light' ? 'navbar-shell--solid-light' : 'navbar-shell--solid-dark',
      mobileBar && 'navbar-shell--mobile-scroll',
    );
  }

  if (showNavGlass) {
    return cn(
      'navbar-shell navbar-shell--glass',
      navVariant === 'light' ? 'navbar-shell--glass-light' : 'navbar-shell--glass-dark',
    );
  }

  return 'navbar-shell';
}

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isCinematicPage =
    pathname === '/' ||
    pathname === '/qui-sommes-nous' ||
    pathname === '/secteurs' ||
    pathname === '/projets' ||
    pathname.startsWith('/projets/') ||
    pathname === '/contact';
  const isInteriorPage = isCinematicPage && !isHome;
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

  const navOnDark = isInteriorPage || (isCinematicPage ? headerTheme !== 'light' : false);
  const useSolidBar = scrolled || isInteriorPage;
  const navVariant: 'hero' | 'light' = navOnDark ? 'hero' : 'light';
  const showNavGlass = isCinematicPage && !useSolidBar && headerTheme === 'light';
  const mobileScrolledBar = isMobile && scrolled;
  const shellOptions = { scrolled: useSolidBar, showNavGlass, mobileBar: mobileScrolledBar };

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
  }, [evaluateNavMode, showNavGlass, scrolled, pathname, navVariant]);

  const hideNavChromeDesktop = hideLogo && !isMobile;
  const showInlineNav = (scrolled || !compactNav) && !hideNavChromeDesktop;
  const showMenuButton = !scrolled && compactNav && (!hideLogo || isMobile) && !hideNavChromeDesktop;

  return (
    <header
      className={cn(
        'site-navbar',
        navOnDark ? 'site-navbar--dark' : 'site-navbar--light',
        useSolidBar && 'site-navbar--scrolled site-navbar--solid',
        isInteriorPage && 'site-navbar--interior',
        mobileScrolledBar && 'site-navbar--mobile-bar',
        isHome && 'lg:px-10',
        !isHome && 'lg:pl-[calc(3.5rem+1.5rem)] lg:pr-14 xl:pl-[calc(4rem+2rem)]',
        hideNavChromeDesktop && 'md:pointer-events-none md:invisible md:opacity-0',
      )}
      data-nav-theme={navOnDark ? 'dark' : 'light'}
    >
      <div className="site-navbar__backdrop" aria-hidden />

      <div
        ref={rowRef}
        className={cn(
          'site-navbar__inner',
          hideLogo ? 'justify-end' : 'justify-between',
          mobileScrolledBar && 'site-navbar__inner--bar',
        )}
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
              getNavShellClass(navVariant, shellOptions),
            )}
            aria-hidden
          >
            {renderNavItems(pathname, navVariant)}
          </div>

          {showInlineNav ? (
            <nav
              className={getNavShellClass(navVariant, shellOptions)}
              aria-label="Navigation principale"
            >
              {mobileScrolledBar
                ? renderMobileBarItems(pathname, navVariant)
                : renderNavItems(pathname, navVariant)}
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
                    {MAIN_NAV.map((item, index) => (
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
