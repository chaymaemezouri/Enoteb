'use client';

import { SiteFooter } from '@/components/layout/SiteFooter';
import { FOOTER_SECTION_BG } from '@/lib/footer-theme';
import { OrangeCtaBanner } from './OrangeCtaBanner';

export function CtaFooterSection() {
  return (
    <div
      className="cta-footer-suite relative overflow-hidden"
      style={{ backgroundColor: FOOTER_SECTION_BG }}
      data-header-theme="dark"
    >
      <OrangeCtaBanner />
      <SiteFooter variant="suite" />
    </div>
  );
}
