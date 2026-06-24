import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import { Footer, Header, Sidebar, SkipLink, WhatsAppButton } from '@/components/layout';
import { siteConfig } from '@/config/site';
import { ACTIVE_PALETTE } from '@/config/theme';
import { cn } from '@/lib/cn';
import { absoluteUrl, defaultSiteDescription, getSiteUrl } from '@/lib/seo';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const playfair = Playfair_Display({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-serif',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: defaultSiteDescription,
  keywords: [
    'eNoteb',
    'BTP Maroc',
    'construction industrielle',
    'ingénierie',
    'pharmaceutique',
    'énergies renouvelables',
    'Casablanca',
  ],
  authors: [{ name: siteConfig.name, url: getSiteUrl() }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [{ url: '/images/logo_enoteb.png', type: 'image/png' }],
    shortcut: ['/images/logo_enoteb.png'],
    apple: [{ url: '/images/logo_enoteb.png', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: getSiteUrl(),
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: defaultSiteDescription,
    images: [
      {
        url: absoluteUrl('/opengraph-image'),
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — ${siteConfig.tagline}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: defaultSiteDescription,
    images: [absoluteUrl('/opengraph-image')],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = headers().get('x-pathname') ?? '';
  const isAdmin = pathname.startsWith('/admin');
  const isHome = pathname === '/' || pathname === '';
  const isFullBleedHero =
    pathname === '/qui-sommes-nous' || pathname === '/secteurs' || pathname === '/projets';

  return (
    <html lang="fr" data-palette={ACTIVE_PALETTE}>
      <body className={`${plusJakarta.variable} ${playfair.variable} font-sans`}>
        {isAdmin ? (
          children
        ) : (
          <>
            <SkipLink />
            <Header />
            <main
              id="main-content"
              className={cn(
                'relative min-h-[60vh] bg-transparent',
                isHome || isFullBleedHero ? '' : 'pt-20 sm:pt-24',
              )}
            >
              {children}
            </main>
            {!isHome ? <Sidebar /> : null}
            {!isHome && !isFullBleedHero ? <Footer /> : null}
            <WhatsAppButton />
          </>
        )}
      </body>
    </html>
  );
}
