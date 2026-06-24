'use client';

import { SiteFooter } from '@/components/layout/SiteFooter';
import { FOOTER_SECTION_BG } from '@/lib/footer-theme';
import { HomeCtaBlock } from './HomeCtaBlock';
import { PartnersSection } from './PartnersSection';

export function CtaFooterSection() {
  return (
    <div
      className="relative"
      style={{ backgroundColor: FOOTER_SECTION_BG }}
      data-header-theme="dark"
    >
      <PartnersSection placement="cta" />
      <HomeCtaBlock />
      <SiteFooter />
    </div>
  );
}
