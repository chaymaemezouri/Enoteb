'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Mail, Phone } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { siteConfig } from '@/config/site';
import { getPhoneTelHref } from '@/lib/contact';
import { cn } from '@/lib/cn';

const contactLinks = [
  {
    id: 'email',
    href: `mailto:${siteConfig.contact.email}`,
    label: `Envoyer un email à ${siteConfig.contact.email}`,
    icon: Mail,
  },
  {
    id: 'phone',
    href: siteConfig.contact.phone
      ? getPhoneTelHref(siteConfig.contact.phone)
      : '/contact',
    label: siteConfig.contact.phone
      ? `Appeler le ${siteConfig.contact.phone}`
      : 'Nous contacter par téléphone',
    icon: Phone,
  },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  const circleClass = cn(
    'link-focus flex h-6 w-6 items-center justify-center rounded-full border transition-colors duration-300',
    isHome
      ? 'border-white/15 text-white/35 hover:border-white/25 hover:text-white/55'
      : 'border-neutral-300/40 text-neutral-400/80 hover:border-neutral-400 hover:text-neutral-500',
  );

  const iconClass = 'h-2.5 w-2.5';

  return (
    <aside
      className="pointer-events-none fixed bottom-0 left-0 top-0 z-50 hidden w-14 lg:flex xl:w-16"
      aria-label="Navigation latérale"
    >
      <div
        className={cn(
          'sidebar-glass absolute inset-0',
          isHome ? 'sidebar-glass--hero' : 'sidebar-glass--light',
        )}
        aria-hidden
      />

      <div className="relative z-10 flex h-full w-full flex-col items-center pb-7 pt-5">
        <Link
          href="/"
          className="link-focus pointer-events-auto flex h-[3.25rem] w-[3.25rem] shrink-0 items-center justify-center xl:h-14 xl:w-14"
          aria-label={`${siteConfig.name} — Accueil`}
        >
          <Image
            src={siteConfig.logo.src}
            alt=""
            width={56}
            height={56}
            className="h-[3.25rem] w-[3.25rem] object-contain xl:h-14 xl:w-14"
            priority
          />
        </Link>

        <div className="flex-1" aria-hidden />

        <div className="pointer-events-auto flex shrink-0 flex-col items-center gap-2.5 pb-1">
          {contactLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.id}
                href={link.href}
                aria-label={link.label}
                className={circleClass}
              >
                <Icon className={iconClass} strokeWidth={1.75} aria-hidden />
              </a>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
