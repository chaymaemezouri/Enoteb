import type { Metadata } from 'next';
import { SiteFooter } from '@/components/layout/SiteFooter';
import {
  AboutDna,
  AboutDomains,
  AboutEngagements,
  AboutFoundations,
  AboutHero,
  AboutPartners,
  AboutPillars,
  AboutResources,
  AboutStats,
} from '@/components/about';
import { aboutContent } from '@/config/about';
import { FOOTER_SECTION_BG } from '@/lib/footer-theme';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: aboutContent.meta.title,
  description: aboutContent.meta.description,
  path: '/qui-sommes-nous',
  image: aboutContent.hero.imageSrc,
});

export default function AboutPage() {
  return (
    <div className="about-page about-v2">
      <AboutHero />
      <AboutStats />
      <AboutFoundations />
      <AboutDna />
      <AboutPillars />
      <AboutDomains />
      <AboutResources />
      <AboutEngagements />
      <AboutPartners />
      <div style={{ backgroundColor: FOOTER_SECTION_BG }} data-header-theme="dark">
        <SiteFooter />
      </div>
    </div>
  );
}
