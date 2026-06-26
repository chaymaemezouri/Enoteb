'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  ExternalLink,
  FolderKanban,
  Inbox,
  LayoutDashboard,
  Layers,
  LogOut,
  Menu,
  Settings,
  X,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { adminApi } from '@/lib/admin-api';
import { resolveAdminAvatarUrl } from '@/lib/admin-utils';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/cn';

const navItems = [
  { href: '/admin/dashboard', label: 'Tableau de bord', icon: LayoutDashboard, exact: true },
  { href: '/admin/demandes', label: 'Demandes', icon: Inbox },
  { href: '/admin/projects', label: 'Projets', icon: FolderKanban },
  { href: '/admin/sectors', label: 'Secteurs', icon: Layers },
  { href: '/admin/settings', label: 'Compte', icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout, profile, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadDemandes, setUnreadDemandes] = useState(0);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    let cancelled = false;

    async function loadUnread() {
      try {
        const dashboard = await adminApi.getDashboard();
        if (!cancelled) {
          setUnreadDemandes(dashboard.unreadContactCount);
        }
      } catch {
        if (!cancelled) {
          setUnreadDemandes(0);
        }
      }
    }

    void loadUnread();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, pathname]);

  useEffect(() => {
    if (!sidebarOpen) {
      return;
    }

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previous;
    };
  }, [sidebarOpen]);

  return (
    <div className="admin-app">
      <div className="admin-app__grid" aria-hidden />

      <header className="admin-topbar">
        <div className="admin-topbar__backdrop" aria-hidden />
        <div className="admin-topbar__inner">
          <div className="admin-topbar__start">
            <button
              type="button"
              className="admin-topbar__menu-btn link-focus"
              aria-expanded={sidebarOpen}
              aria-controls="admin-sidebar"
              onClick={() => setSidebarOpen((open) => !open)}
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" aria-hidden />
              ) : (
                <Menu className="h-5 w-5" aria-hidden />
              )}
              <span className="sr-only">Menu administration</span>
            </button>

            <Link href="/admin/dashboard" className="admin-topbar__brand link-focus">
              <Image
                src={siteConfig.logo.src}
                alt={`${siteConfig.name} — logo`}
                width={156}
                height={52}
                className="admin-topbar__logo"
                priority
              />
              <span className="admin-topbar__badge">Admin</span>
            </Link>
          </div>

          <div className="admin-topbar__actions">
            <Link href="/" className="admin-topbar__link link-focus">
              <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span>Site public</span>
            </Link>
            <button
              type="button"
              className="admin-topbar__link admin-topbar__link--logout link-focus"
              onClick={() => void logout()}
            >
              <LogOut className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span className="admin-topbar__logout-text">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      <div className="admin-app__layout">
        <button
          type="button"
          className={cn('admin-app__overlay', sidebarOpen && 'admin-app__overlay--visible')}
          aria-label="Fermer le menu"
          onClick={() => setSidebarOpen(false)}
        />

        <aside
          id="admin-sidebar"
          className={cn('admin-app__sidebar', sidebarOpen && 'admin-app__sidebar--open')}
        >
          <nav aria-label="Menu administration" className="admin-app__nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              const showBadge = item.href === '/admin/demandes' && unreadDemandes > 0;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn('admin-app__nav-link', active && 'admin-app__nav-link--active')}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  <span className="admin-app__nav-link-text">{item.label}</span>
                  {showBadge ? (
                    <span className="admin-app__nav-badge" aria-label={`${unreadDemandes} non lues`}>
                      {unreadDemandes}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="admin-app__sidebar-foot">
            {profile ? (
              <div className="admin-app__user-card">
                {profile.avatarUrl ? (
                  <span className="admin-app__user-avatar admin-app__user-avatar--image">
                    <Image
                      src={resolveAdminAvatarUrl(profile.avatarUrl)!}
                      alt=""
                      width={26}
                      height={26}
                      className="admin-app__user-avatar-img"
                      unoptimized
                    />
                  </span>
                ) : (
                  <span className="admin-app__user-avatar" aria-hidden>
                    {profile.name.charAt(0).toUpperCase()}
                  </span>
                )}
                <div className="admin-app__user-info">
                  <p className="admin-app__user-name">{profile.name}</p>
                  <p className="admin-app__user-email">{profile.email}</p>
                </div>
              </div>
            ) : null}
          </div>
        </aside>

        <main className="admin-app__main">{children}</main>
      </div>
    </div>
  );
}
