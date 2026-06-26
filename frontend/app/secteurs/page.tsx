import type { Metadata } from 'next';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SectorsApproach, SectorsGrid, SectorsHero } from '@/components/sectors';
import { BreadcrumbJsonLd } from '@/components/seo';
import { sectorsPageContent } from '@/config/sectors';
import { api } from '@/lib/api';
import { FOOTER_SECTION_BG } from '@/lib/footer-theme';
import { createPageMetadata } from '@/lib/seo';
import type { Sector } from '@/types';

export const revalidate = 300;

export const metadata: Metadata = createPageMetadata({
  title: sectorsPageContent.meta.title,
  description: sectorsPageContent.meta.description,
  path: '/secteurs',
});

async function getSectors(): Promise<Sector[]> {
  try {
    return await api.getSectors({ revalidate: 300 });
  } catch {
    return [];
  }
}

export default async function SectorsPage() {
  const sectors = await getSectors();

  return (
    <div className="sectors-page">
      <BreadcrumbJsonLd
        items={[
          { name: 'Accueil', path: '/' },
          { name: 'Secteurs', path: '/secteurs' },
        ]}
      />
      <SectorsHero />
      <SectorsGrid sectors={sectors} />
      <SectorsApproach />
      <div style={{ backgroundColor: FOOTER_SECTION_BG }} data-header-theme="dark">
        <SiteFooter />
      </div>
    </div>
  );
}
