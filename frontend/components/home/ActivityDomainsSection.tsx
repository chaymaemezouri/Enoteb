'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Building2, ChevronLeft, ChevronRight, Compass, Factory } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { useCallback, useState, type KeyboardEvent } from 'react';
import { homeContent } from '@/config/home';
import { cn } from '@/lib/cn';
import { Container } from '@/components/ui/Container';
import { fadeUpView, HOME_EASE, HOME_VIEWPORT } from './homeMotion';

const NAVY = '#18212B';
const MUTED = '#68717D';
const BG_SECTION = '#F6F2EA';
const CARD_TITLE = '#F8F5EE';
const CARD_DESC = 'rgba(248, 245, 238, 0.82)';

type DomainItem = (typeof homeContent.activityDomains.items)[number];

const DEFAULT_ACTIVE_INDEX = 1;

const ICONS: Record<DomainItem['icon'], LucideIcon> = {
  design: Compass,
  industry: Factory,
  building: Building2,
};

function DomainCard({
  item,
  index,
  isActive,
  reduced,
  onActivate,
}: {
  item: DomainItem;
  index: number;
  isActive: boolean;
  reduced: boolean;
  onActivate: () => void;
}) {
  const Icon = ICONS[item.icon];
  const number = String(index + 1).padStart(2, '0');
  const tilt = !reduced && !isActive ? (index === 0 ? -0.6 : index === 2 ? 0.6 : 0.4) : 0;

  return (
    <motion.article
      role="tab"
      aria-selected={isActive}
      tabIndex={0}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={onActivate}
      onKeyDown={(e: KeyboardEvent<HTMLElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onActivate();
        }
      }}
      animate={
        reduced
          ? undefined
          : {
              opacity: isActive ? 1 : 0.94,
              y: isActive ? -12 : 0,
              rotate: tilt,
              scale: isActive ? 1.06 : 0.94,
            }
      }
      transition={{ duration: 0.55, ease: HOME_EASE }}
      style={{ transformOrigin: 'center bottom' }}
      className={cn(
        'group relative w-full min-w-0 cursor-pointer overflow-hidden rounded-none border bg-[#18212B] outline-none transition-shadow duration-500',
        'aspect-square',
        'focus-visible:ring-2 focus-visible:ring-[#FF6A1A]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F6F2EA]',
        isActive
          ? 'z-10 border-[#FF6A1A]/35 shadow-[0_24px_56px_-18px_rgba(24,33,43,0.35)]'
          : 'border-[#18212B]/12 shadow-[0_14px_36px_-20px_rgba(24,33,43,0.22)]',
        'max-lg:min-w-[min(88vw,340px)] max-lg:snap-center max-lg:shrink-0',
      )}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0"
          animate={reduced ? undefined : { scale: isActive ? 1.05 : 1 }}
          transition={{ duration: 0.7, ease: HOME_EASE }}
        >
          <Image
            src={item.imageSrc}
            alt=""
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 88vw, 40vw"
          />
        </motion.div>
      </div>

      <span
        className={cn(
          'pointer-events-none absolute right-3 top-3 z-[1] select-none font-sans font-bold leading-none tracking-[-0.05em]',
          isActive
            ? 'text-[4.5rem] text-white/[0.07] lg:text-[5.5rem]'
            : 'text-[3.5rem] text-white/[0.05] lg:text-[4.5rem]',
        )}
        aria-hidden
      >
        {number}
      </span>

      <span
        className="pointer-events-none absolute left-0 top-0 z-10 h-7 w-px bg-[#FF6A1A]"
        aria-hidden
      />
      <span
        className={cn(
          'pointer-events-none absolute left-0 top-0 z-10 h-px bg-[#FF6A1A] transition-all duration-500',
          isActive ? 'w-9' : 'w-7',
        )}
        aria-hidden
      />

      <div
        className={cn(
          'absolute inset-x-0 bottom-0 z-10',
          'before:pointer-events-none before:absolute before:inset-x-0 before:-top-12 before:h-12 before:bg-gradient-to-b before:from-transparent before:to-[#18212B]',
          isActive ? 'bg-[#18212B]' : 'bg-[#18212B]/95',
        )}
      >
        <div className="relative px-5 pb-5 pt-1 sm:px-6 sm:pb-6">
          <p className="text-[0.575rem] font-semibold uppercase tracking-[0.22em] text-[#FF6A1A]">
            {number}
          </p>

          <Icon
            className={cn(
              'mt-2.5 h-5 w-5 text-[#FF6A1A] transition-transform duration-500 group-hover:translate-x-0.5',
              isActive && 'translate-x-0.5',
            )}
            strokeWidth={1.25}
            aria-hidden
          />

          <h3
            className={cn(
              'mt-2.5 font-bold leading-snug tracking-[-0.01em]',
              isActive ? 'text-[1.125rem] sm:text-[1.1875rem]' : 'text-[1rem] sm:text-[1.0625rem]',
            )}
            style={{ color: CARD_TITLE }}
          >
            {item.title}
          </h3>

          <p className="mt-2 text-sm leading-[1.6]" style={{ color: CARD_DESC }}>
            {item.description}
          </p>

          {isActive ? (
            <>
              <span className="mt-3.5 block h-px w-10 bg-[#FF6A1A]/75" aria-hidden />
              <Link
                href="/secteurs"
                className="link-focus mt-3 inline-flex items-center gap-1.5 text-[0.575rem] font-semibold uppercase tracking-[0.16em] text-[#FF6A1A] focus-visible:ring-[#FF6A1A]"
                onClick={(e) => e.stopPropagation()}
              >
                Découvrir
                <ArrowUpRight className="h-3 w-3" aria-hidden />
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}

export function ActivityDomainsSection() {
  const { activityDomains } = homeContent;
  const reduced = useReducedMotion() ?? false;
  const [activeIndex, setActiveIndex] = useState(DEFAULT_ACTIVE_INDEX);

  const resetToDefault = useCallback(() => {
    setActiveIndex(DEFAULT_ACTIVE_INDEX);
  }, []);

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i === 0 ? 2 : i - 1));
  }, []);

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i === 2 ? 0 : i + 1));
  }, []);

  return (
    <section
      id="domaines-activites"
      className="activity-domains-section relative scroll-mt-28 overflow-x-hidden pb-10 pt-16 home-shell sm:pt-20 md:pb-20 md:pt-28 lg:pt-32"
      style={{ backgroundColor: BG_SECTION }}
      data-header-theme="light"
      aria-labelledby="activity-domains-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(24,33,43,0.022)_1px,transparent_1px),linear-gradient(90deg,rgba(24,33,43,0.022)_1px,transparent_1px)] bg-[size:72px_72px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FF6A1A]/10 to-transparent"
        aria-hidden
      />

      <Container fluid className="relative px-0">
        <div className="mx-auto text-center">
          <motion.div {...fadeUpView(0, reduced)}>
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-[#FF6A1A]" aria-hidden />
              <p className="section-label">{activityDomains.overline}</p>
              <span className="h-px w-8 bg-[#FF6A1A]" aria-hidden />
            </div>
          </motion.div>

          <motion.h2
            {...fadeUpView(0.08, reduced)}
            id="activity-domains-heading"
            className="enoteb-title enoteb-title--section enoteb-title--on-light mx-auto mt-5 max-w-[850px]"
          >
            {activityDomains.title}
          </motion.h2>

          <motion.p
            {...fadeUpView(0.16, reduced)}
            className="enoteb-lead enoteb-lead--on-light mx-auto mt-4 max-w-[720px]"
          >
            {activityDomains.description}
          </motion.p>
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={HOME_VIEWPORT}
          transition={{ duration: 0.7, delay: 0.15, ease: HOME_EASE }}
          className="mt-10 overflow-visible sm:mt-12"
          role="tablist"
          aria-label={activityDomains.overline}
          onMouseLeave={resetToDefault}
        >
          <div className="hidden items-end gap-3 overflow-visible py-3 md:grid md:grid-cols-3 md:gap-4">
            {activityDomains.items.map((item, index) => (
              <DomainCard
                key={item.title}
                item={item}
                index={index}
                isActive={activeIndex === index}
                reduced={reduced}
                onActivate={() => setActiveIndex(index)}
              />
            ))}
          </div>

          <div className="-mx-[clamp(1.25rem,4vw,2rem)] flex gap-3 overflow-x-auto px-[clamp(1.25rem,4vw,2rem)] pb-2 snap-x snap-mandatory scrollbar-none md:hidden">
            {activityDomains.items.map((item, index) => (
              <DomainCard
                key={item.title}
                item={item}
                index={index}
                isActive={activeIndex === index}
                reduced={reduced}
                onActivate={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </motion.div>

        <div className="mt-8 flex items-center justify-center gap-3 sm:mt-10">
          <button
            type="button"
            onClick={goPrev}
            className="link-focus flex h-10 w-10 items-center justify-center rounded-none border border-[#18212B]/14 bg-[#F6F2EA] text-[#18212B] transition-colors duration-300 hover:border-[#FF6A1A]/50 hover:text-[#FF6A1A] focus-visible:ring-[#FF6A1A]"
            aria-label="Pôle précédent"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={1.5} aria-hidden />
          </button>

          <div className="flex items-center gap-2.5 px-1">
            {activityDomains.items.map((item, index) => (
              <button
                key={item.title}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={cn(
                  'rounded-none transition-all duration-500',
                  activeIndex === index
                    ? 'h-2.5 w-8 bg-[#FF6A1A]'
                    : 'h-2.5 w-2.5 bg-[#18212B]/20 hover:bg-[#18212B]/35',
                )}
                aria-label={`${item.title}${activeIndex === index ? ' — actif' : ''}`}
                aria-current={activeIndex === index ? 'true' : undefined}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={goNext}
            className="link-focus flex h-10 w-10 items-center justify-center rounded-none border border-[#18212B]/14 bg-[#F6F2EA] text-[#18212B] transition-colors duration-300 hover:border-[#FF6A1A]/50 hover:text-[#FF6A1A] focus-visible:ring-[#FF6A1A]"
            aria-label="Pôle suivant"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
          </button>
        </div>
      </Container>
    </section>
  );
}
