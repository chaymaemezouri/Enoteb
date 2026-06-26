'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { homeContent } from '@/config/home';
import { cn } from '@/lib/cn';
import { fadeUpView } from './homeMotion';

const TRACK_REPEATS = 2;

function PartnerLogoSlot({
  name,
  logo,
  compact,
}: {
  name: string;
  logo: string;
  compact?: boolean;
}) {
  const colorLogo = logo.replace('/partenaires/mono/', '/partenaires/');
  const [colorAvailable, setColorAvailable] = useState(colorLogo !== logo);

  return (
    <div
      className={cn(
        'partner-logo-slot flex h-11 shrink-0 items-center justify-center sm:h-12 md:h-14 lg:h-[3.75rem]',
        compact ? 'mx-2 sm:mx-2.5 md:mx-3' : 'mx-5 sm:mx-6 md:mx-8 lg:mx-10',
      )}
    >
      <div
        className={cn(
          'relative flex h-full items-center justify-center',
          compact
            ? 'w-[4.5rem] sm:w-[5.25rem] md:w-[6rem] lg:w-[6.75rem]'
            : 'w-[7rem] sm:w-[8rem] md:w-[9rem] lg:w-[10rem]',
        )}
      >
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
  compact,
}: {
  items: typeof homeContent.partners.items;
  trackId: string;
  ariaHidden?: boolean;
  compact?: boolean;
}) {
  const track = Array.from({ length: TRACK_REPEATS }, () => items).flat();

  return (
    <div className="flex shrink-0 items-center" aria-hidden={ariaHidden}>
      {track.map((partner, index) => (
        <PartnerLogoSlot
          key={`${trackId}-${partner.name}-${index}`}
          name={partner.name}
          logo={partner.logo}
          compact={compact}
        />
      ))}
    </div>
  );
}

function PartnersMarquee({ reduced, embedded }: { reduced: boolean; embedded?: boolean }) {
  const { partners } = homeContent;

  if (reduced) {
    return (
      <ul className="home-shell flex flex-wrap justify-center gap-x-5 gap-y-4 sm:gap-x-6">
        {partners.items.map((partner) => (
          <li key={partner.name} className="list-none">
            <PartnerLogoSlot name={partner.name} logo={partner.logo} compact />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <motion.div
      {...fadeUpView(0, reduced)}
      className={cn(
        'partners-marquee-bleed relative overflow-hidden',
        embedded && 'partners-marquee-bleed--embedded',
      )}
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
        <PartnerTrack items={partners.items} trackId="a" compact />
        <PartnerTrack items={partners.items} trackId="b" ariaHidden compact />
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
          ? 'partners-section--embedded py-3 sm:py-4'
          : 'partners-section--below-hero pt-12 pb-8 sm:pt-14 sm:pb-9 md:pt-16 md:pb-10',
      )}
      data-header-theme="dark"
      aria-label="Logos partenaires"
    >
      {!embedded ? (
        <div
          className="partners-section--editorial__bottom-fade pointer-events-none absolute inset-x-0 bottom-0 z-[5]"
          aria-hidden
        />
      ) : null}
      <PartnersMarquee reduced={reduced} embedded={embedded} />
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
          <PartnerTrack items={partners.items} trackId="strip-a" compact />
          <PartnerTrack items={partners.items} trackId="strip-b" ariaHidden compact />
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
