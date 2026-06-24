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

function isNavActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname.startsWith(href);
}

function NavLink({
  href,
  label,
  pathname,
  onClick,
  linkRef,
  variant,
}: {
  href: string;
  label: string;
  pathname: string;
  onClick?: () => void;
  linkRef?: Ref<HTMLAnchorElement>;
  variant: 'hero' | 'light';
}) {
  const isActive = isNavActive(pathname, href);
  const isHero = variant === 'hero';

  return (
    <Link
      ref={linkRef}
      href={href}
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'link-focus nav-link relative whitespace-nowrap px-0 py-1 text-[0.8125rem] font-medium tracking-wide transition-colors duration-300',
        isHero
          ? isActive
            ? '!text-white'
            : '!text-white/85 hover:!text-white'
          : isActive
            ? 'text-[#18212B]'
            : 'text-[#18212B]/58 hover:text-[#18212B]',
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
  const isHero = variant === 'hero';
  const isActive = DROPDOWN_NAV.some((item) => isNavActive(pathname, item.href));

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
        className={cn(
          'link-focus nav-link inline-flex items-center gap-1.5 whitespace-nowrap px-0 py-1 text-[0.8125rem] font-medium tracking-wide transition-colors duration-300',
          isHero
            ? isActive || open
              ? '!text-white'
              : '!text-white/85 hover:!text-white'
            : isActive || open
              ? 'text-[#18212B]'
              : 'text-[#18212B]/58 hover:text-[#18212B]',
        )}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls="navbar-dropdown-menu"
        onClick={() => setOpen((value) => !value)}
      >
        À propos
        <ChevronDown
          className={cn(
            'h-3 w-3 opacity-70 transition-transform duration-200',
            open && 'rotate-180',
          )}
          aria-hidden
        />
      </button>

      {open ? (
        <div
          id="navbar-dropdown-menu"
          role="menu"
          className={cn(
            'absolute right-0 top-[calc(100%+0.65rem)] z-50 min-w-[12.5rem] border py-1.5 backdrop-blur-xl',
            isHero
              ? 'border-white/10 bg-[#171a20]/90'
              : 'border-[#252A30]/8 bg-white/95 shadow-lg shadow-black/5',
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
                className={cn(
                  'link-focus block px-4 py-2.5 text-[0.6875rem] font-medium uppercase tracking-[0.16em] transition-colors',
                  isHero
                    ? itemActive
                      ? 'text-white'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                    : itemActive
                      ? 'text-[#18212B]'
                      : 'text-[#18212B]/65 hover:bg-[#18212B]/5 hover:text-[#18212B]',
                )}
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
  const isHero = variant === 'hero';

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
          'h-10 w-auto max-w-[132px] object-contain sm:h-11 sm:max-w-[148px]',
          !isHero && 'brightness-0 opacity-90',
        )}
        priority
      />
      <span className="sr-only">{siteConfig.name}</span>
    </Link>
  );
}

function getNavShellClass(showNavGlass: boolean, navVariant: 'hero' | 'light') {
  return cn(
    'flex items-center gap-6 sm:gap-8',
    showNavGlass &&
      'rounded-full border px-5 py-2 backdrop-blur-md transition-[background-color,border-color] duration-300 sm:px-6',
    showNavGlass &&
      (navVariant === 'light'
        ? 'border-[#18212B]/10 bg-[#F6F2EA]/88 shadow-sm shadow-[#18212B]/5'
        : 'border-white/[0.08] bg-[#0B1117]/[0.28]'),
  );
}

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isCinematicPage =
    pathname === '/' ||
    pathname === '/qui-sommes-nous' ||
    pathname === '/secteurs' ||
    pathname === '/projets';
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

  const menuButtonClass = cn(
    'link-focus inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors',
    navVariant === 'hero'
      ? 'border-white/20 bg-white/[0.04] text-white hover:border-white/35 hover:bg-white/[0.08]'
      : 'border-[#18212B]/12 bg-[#F6F2EA]/80 text-[#18212B] hover:border-[#FF6A1A]/35 hover:bg-[#F6F2EA] hover:text-[#FF6A1A]',
  );

  return (
    <header
      className={cn(
        'pointer-events-none fixed left-0 right-0 top-0 z-40 px-5 py-5 sm:px-8 sm:py-6',
        navOnDark && 'navbar-on-dark',
        isHome ? 'lg:px-10' : 'lg:pl-[calc(3.5rem+1.5rem)] lg:pr-14 xl:pl-[calc(4rem+2rem)]',
        hideNavChromeDesktop && 'md:pointer-events-none md:invisible md:opacity-0',
      )}
      data-nav-theme={navOnDark ? 'dark' : 'light'}
    >
      <div
        ref={rowRef}
        className={cn(
          'pointer-events-auto flex w-full items-center gap-4',
          hideLogo ? 'justify-end' : 'justify-between',
        )}
      >
        {!hideLogo ? (
          <div ref={brandRef} className="flex min-w-0 shrink-0 items-center">
            <BrandLogo variant={navVariant} />
          </div>
        ) : (
          <div ref={brandRef} className="sr-only" aria-hidden />
        )}

        <div className="flex min-w-0 items-center justify-end gap-3">
          <div
            ref={navSizerRef}
            className={cn(
              'pointer-events-none absolute -left-[9999px] top-0 flex h-0 overflow-hidden opacity-0',
              getNavShellClass(showNavGlass, navVariant),
            )}
            aria-hidden
          >
            <NavDropdown pathname={pathname} variant={navVariant} />
            {TOP_NAV.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                pathname={pathname}
                variant={navVariant}
              />
            ))}
          </div>

          {!showHamburger ? (
            <nav
              className={getNavShellClass(showNavGlass, navVariant)}
              aria-label="Navigation principale"
            >
              <NavDropdown pathname={pathname} variant={navVariant} />
              {TOP_NAV.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  pathname={pathname}
                  variant={navVariant}
                />
              ))}
            </nav>
          ) : null}

          {showMenuButton ? (
            <div ref={menuContainerRef} className="relative">
              <button
                ref={menuButtonRef}
                type="button"
                className={menuButtonClass}
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
                    'pointer-events-auto absolute right-0 top-[calc(100%+0.5rem)] z-50 min-w-[12rem] border py-1.5 backdrop-blur-xl',
                    navVariant === 'hero'
                      ? 'border-white/10 bg-[#171a20]/95 shadow-lg shadow-black/25'
                      : 'border-[#252A30]/8 bg-white/95 shadow-lg shadow-black/5',
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
                        className={cn(
                          'link-focus block px-4 py-2.5 text-[0.6875rem] font-medium uppercase tracking-[0.16em] transition-colors',
                          navVariant === 'hero'
                            ? isNavActive(pathname, item.href)
                              ? 'text-white'
                              : 'text-white/70 hover:bg-white/5 hover:text-white'
                            : isNavActive(pathname, item.href)
                              ? 'text-[#18212B]'
                              : 'text-[#18212B]/65 hover:bg-[#18212B]/5 hover:text-[#18212B]',
                        )}
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
