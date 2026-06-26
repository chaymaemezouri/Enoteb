'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { homeContent } from '@/config/home';
import { cn } from '@/lib/cn';
import { fadeUpView } from './homeMotion';

const TRACK_REPEATS = 2;

function PartnerLogoSlot({ name, logo }: { name: string; logo: string }) {
  const colorLogo = logo.replace('/partenaires/mono/', '/partenaires/');
  const [colorAvailable, setColorAvailable] = useState(colorLogo !== logo);

  return (
    <div className="partner-logo-slot mx-8 flex h-11 shrink-0 items-center justify-center sm:mx-10 sm:h-12 md:mx-12 md:h-14 lg:mx-14 lg:h-[3.75rem]">
      <div className="relative flex h-full w-[9rem] items-center justify-center sm:w-[11rem] md:w-[12.5rem] lg:w-[14rem]">
        <Image
          src={logo}
          alt={name}
          width={220}
          height={80}
          className={cn(
            'partner-logo-slot__img h-full w-full max-w-full object-contain object-center',
            colorAvailable ? '' : 'partner-logo-slot__img--solo',
          )}
        />
        {colorAvailable ? (
          <Image
            src={colorLogo}
            alt=""
            width={220}
            height={80}
            aria-hidden
            onError={() => setColorAvailable(false)}
            className="partner-logo-slot__img partner-logo-slot__img--color absolute inset-0 m-auto h-full w-full max-w-full object-contain object-center"
          />
        ) : null}
      </div>
    </div>
  );
}

function PartnerTrack({
  items,
  trackId,
  ariaHidden,
}: {
  items: typeof homeContent.partners.items;
  trackId: string;
  ariaHidden?: boolean;
}) {
  const track = Array.from({ length: TRACK_REPEATS }, () => items).flat();

  return (
    <div className="flex shrink-0 items-center" aria-hidden={ariaHidden}>
      {track.map((partner, index) => (
        <PartnerLogoSlot
          key={`${trackId}-${partner.name}-${index}`}
          name={partner.name}
          logo={partner.logo}
        />
      ))}
    </div>
  );
}

function PartnersMarquee({ reduced }: { reduced: boolean }) {
  const { partners } = homeContent;

  if (reduced) {
    return (
      <ul className="home-shell flex flex-wrap justify-center gap-x-7 gap-y-4">
        {partners.items.map((partner) => (
          <li key={partner.name} className="list-none">
            <PartnerLogoSlot name={partner.name} logo={partner.logo} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <motion.div
      {...fadeUpView(0, reduced)}
      className="partners-marquee-bleed relative overflow-hidden"
    >
      <div
        className="partners-marquee-bleed__fade partners-marquee-bleed__fade--left pointer-events-none absolute inset-y-0 left-0 z-10 w-16 sm:w-24 lg:w-32"
        aria-hidden
      />
      <div
        className="partners-marquee-bleed__fade partners-marquee-bleed__fade--right pointer-events-none absolute inset-y-0 right-0 z-10 w-16 sm:w-24 lg:w-32"
        aria-hidden
      />
      <div
        className="flex w-max animate-partners-marquee"
        style={{ '--partners-marquee-duration': '140s' } as React.CSSProperties}
      >
        <PartnerTrack items={partners.items} trackId="a" />
        <PartnerTrack items={partners.items} trackId="b" ariaHidden />
      </div>
    </motion.div>
  );
}

function PartnersEditorialSection({ embedded }: { embedded?: boolean }) {
  const reduced = useReducedMotion() ?? false;
  const Tag = embedded ? 'div' : 'section';

  return (
    <Tag
      className={cn(
        'partners-section partners-section--editorial relative overflow-x-hidden',
        embedded
          ? 'partners-section--embedded py-8 sm:py-10'
          : 'partners-section--below-hero py-9 sm:py-10 md:py-12',
      )}
      data-header-theme="dark"
      aria-label="Logos partenaires"
    >
      <div
        className="partners-section--editorial__bottom-fade pointer-events-none absolute inset-x-0 bottom-0 z-[5]"
        aria-hidden
      />
      <PartnersMarquee reduced={reduced} />
    </Tag>
  );
}

/** Bandeau compact sous le hero (legacy) */
function PartnersStripSection() {
  const { partners } = homeContent;
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      className="partners-section relative z-10 overflow-hidden"
      data-header-theme="dark"
      aria-labelledby="partners-overline"
    >
      <div className="relative home-shell">
        <motion.header {...fadeUpView(0, reduced)} className="mb-1 text-center sm:mb-1.5">
          <p
            id="partners-overline"
            className="partners-overline text-[0.5625rem] font-semibold uppercase tracking-[0.28em] sm:text-[0.625rem]"
          >
            {partners.overline}
          </p>
        </motion.header>
      </div>

      <div className="relative mt-3 overflow-hidden sm:mt-3.5">
        <div
          className="partners-edge-fade partners-edge-fade--left pointer-events-none absolute inset-y-0 left-0 z-10 w-14 sm:w-20 lg:w-28"
          aria-hidden
        />
        <div
          className="partners-edge-fade partners-edge-fade--right pointer-events-none absolute inset-y-0 right-0 z-10 w-14 sm:w-20 lg:w-28"
          aria-hidden
        />
        <div
          className="flex w-max animate-partners-marquee"
          style={{ '--partners-marquee-duration': '180s' } as React.CSSProperties}
          aria-label="Logos partenaires"
        >
          <PartnerTrack items={partners.items} trackId="strip-a" />
          <PartnerTrack items={partners.items} trackId="strip-b" ariaHidden />
        </div>
      </div>
    </section>
  );
}

export function PartnersSection({
  placement = 'hero',
  embedded,
}: {
  placement?: 'hero' | 'cta';
  embedded?: boolean;
}) {
  if (placement === 'cta') {
    return <PartnersEditorialSection embedded={embedded} />;
  }

  return <PartnersStripSection />;
}
