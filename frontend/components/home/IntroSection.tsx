'use client';

import { EnterpriseSection } from './EnterpriseSection';
import { PartnersSection } from './PartnersSection';

/** @deprecated Use PartnersSection + EnterpriseSection directly */
export function IntroSection() {
  return (
    <>
      <PartnersSection />
      <EnterpriseSection />
    </>
  );
}
