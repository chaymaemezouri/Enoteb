'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FolderKanban, Layers, LogOut } from 'lucide-react';
import { Logo } from '@/components/layout/Logo';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

const navItems = [
  { href: '/admin/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/admin/projects', label: 'Projets', icon: FolderKanban },
  { href: '/admin/sectors', label: 'Secteurs', icon: Layers },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-neutral-100">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="link-focus shrink-0">
              <Logo size="sm" />
            </Link>
            <div>
              <p className="text-body-sm font-medium text-neutral-500">Espace administration</p>
              <h1 className="sr-only">ENOTEB — Administration</h1>
            </div>
          </div>
          <Button type="button" variant="outline" size="md" onClick={() => void logout()}>
            <LogOut className="h-4 w-4" aria-hidden />
            Se déconnecter
          </Button>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row">
        <nav
          aria-label="Menu administration"
          className="flex shrink-0 flex-row gap-2 overflow-x-auto lg:w-56 lg:flex-col"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'inline-flex min-h-12 items-center gap-3 rounded-button px-4 text-body font-medium transition-colors',
                  active
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-white text-neutral-800 hover:bg-neutral-50',
                )}
              >
                <Icon className="h-5 w-5" aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
