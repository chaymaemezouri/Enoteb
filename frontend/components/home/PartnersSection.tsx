'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { homeContent } from '@/config/home';
import { cn } from '@/lib/cn';
import { fadeUpView } from './homeMotion';

/** Répétitions par piste pour couvrir les grands écrans sans trou */
const TRACK_REPEATS = 3;

function PartnerLogo({ name, logo, theme = 'dark' }: { name: string; logo: string; theme?: 'dark' | 'light' }) {
  const colorLogo = logo.replace('/partenaires/mono/', '/partenaires/');
  const [colorAvailable, setColorAvailable] = useState(colorLogo !== logo);
  const isLight = theme === 'light';

  return (
    <div
      className={cn('partner-pill group mx-2 shrink-0 sm:mx-2.5', isLight && 'partner-pill--light')}
    >
      <div className="relative flex h-10 w-full min-w-0 items-center justify-center sm:h-11">
        {isLight && colorAvailable ? (
          <Image
            src={colorLogo}
            alt={name}
            width={220}
            height={80}
            className="partners-logo partners-logo--light h-full w-full max-w-full object-contain object-center"
          />
        ) : isLight ? (
          <Image
            src={logo}
            alt={name}
            width={220}
            height={80}
            className="partners-logo partners-logo--light-mono h-full w-full max-w-full object-contain object-center"
          />
        ) : (
          <>
            <Image
              src={logo}
              alt={name}
              width={220}
              height={80}
              className={`partners-logo partners-logo--mono h-full w-full max-w-full object-contain object-center ${
                colorAvailable ? '' : 'partners-logo--mono-hover-color'
              }`}
            />
            {colorAvailable ? (
              <Image
                src={colorLogo}
                alt=""
                width={220}
                height={80}
                aria-hidden
                onError={() => setColorAvailable(false)}
                className="partners-logo partners-logo--color h-full w-full max-w-full object-contain object-center"
              />
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

function PartnerTrack({
  items,
  trackId,
  ariaHidden,
  theme = 'dark',
}: {
  items: typeof homeContent.partners.items;
  trackId: string;
  ariaHidden?: boolean;
  theme?: 'dark' | 'light';
}) {
  const track = Array.from({ length: TRACK_REPEATS }, () => items).flat();

  return (
    <div className="flex shrink-0 items-center" aria-hidden={ariaHidden}>
      {track.map((partner, index) => (
        <PartnerLogo
          key={`${trackId}-${partner.name}-${index}`}
          name={partner.name}
          logo={partner.logo}
          theme={theme}
        />
      ))}
    </div>
  );
}

export function PartnersSection({ placement = 'hero' }: { placement?: 'hero' | 'cta' }) {
  const { partners } = homeContent;
  const reduced = useReducedMotion() ?? false;
  const isCta = placement === 'cta';

  return (
    <section
      className={cn(
        'partners-section relative z-10 overflow-hidden',
        isCta && 'partners-section--cta',
      )}
      style={isCta ? { backgroundColor: '#F6F2EA' } : undefined}
      data-header-theme={isCta ? 'light' : 'dark'}
      aria-labelledby="partners-overline"
    >
      {isCta ? (
        <>
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(24,33,43,0.014)_1px,transparent_1px),linear-gradient(90deg,rgba(24,33,43,0.014)_1px,transparent_1px)] bg-[size:80px_80px]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_38%_at_100%_8%,rgba(255,106,26,0.06),transparent_58%)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,106,26,0.1)] to-transparent"
            aria-hidden
          />
        </>
      ) : null}

      <div className={cn('relative px-[7%]', isCta && 'pt-1')}>
        <motion.header
          {...fadeUpView(0, reduced)}
          className={cn('text-center', isCta ? 'mb-7 sm:mb-8' : 'mb-1 sm:mb-1.5')}
        >
          {isCta ? (
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-[#FF6A1A]" aria-hidden />
              <p
                id="partners-overline"
                className="partners-overline text-[0.5625rem] font-semibold uppercase tracking-[0.28em] text-[#FF6A1A] sm:text-[0.625rem]"
              >
                {partners.overline}
              </p>
              <span className="h-px w-8 bg-[#FF6A1A]" aria-hidden />
            </div>
          ) : (
            <p
              id="partners-overline"
              className="partners-overline text-[0.5625rem] font-semibold uppercase tracking-[0.28em] sm:text-[0.625rem]"
            >
              {partners.overline}
            </p>
          )}
        </motion.header>
      </div>

      {reduced ? (
        <ul
          className={cn(
            'flex flex-wrap justify-center gap-2 px-[7%]',
            isCta ? 'mt-2 sm:mt-3' : 'mt-3 sm:mt-3.5',
          )}
        >
          {partners.items.map((partner) => (
            <li key={partner.name} className="list-none">
              <PartnerLogo name={partner.name} logo={partner.logo} theme={isCta ? 'light' : 'dark'} />
            </li>
          ))}
        </ul>
      ) : (
        <div
          className={cn('relative overflow-hidden', isCta ? 'mt-2 sm:mt-3' : 'mt-3 sm:mt-3.5')}
        >
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
            <PartnerTrack items={partners.items} trackId="a" theme={isCta ? 'light' : 'dark'} />
            <PartnerTrack items={partners.items} trackId="b" theme={isCta ? 'light' : 'dark'} ariaHidden />
          </div>
        </div>
      )}
    </section>
  );
}
