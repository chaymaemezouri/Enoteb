'use client';

import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { homeContent } from '@/config/home';
import { AnimatedCounter } from './AnimatedCounter';

const EASE = [0.16, 1, 0.3, 1] as const;

const fadeUp = (delay: number, reduced: boolean, duration = 0.95) =>
  reduced
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        transition: { duration, delay, ease: EASE },
      };

function HeroVideoBackground({
  posterSrc,
  posterFallback,
  videoSrc,
}: {
  posterSrc: string;
  posterFallback: string;
  videoSrc: string;
}) {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${posterSrc}), url(${posterFallback})`,
          backgroundPosition: '50% 42%',
        }}
      />
      <video
        id="enoteb-hero-video"
        className="hero-video-cinematic absolute inset-0 h-full w-full object-cover object-[50%_42%]"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={posterSrc}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
    </div>
  );
}

function HeroOverlays() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[#111820]/28" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_80%_55%_at_50%_42%,rgba(17,24,32,0.55),transparent_70%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-[#111820]/72 via-[#111820]/18 to-[#111820]/22"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-44 bg-gradient-to-t from-[#111820] from-35% via-[#111820]/95 to-transparent sm:h-52"
        aria-hidden
      />
      <div
        className="hero-watermark-mask pointer-events-none absolute bottom-0 right-0 z-[3] sm:bottom-0"
        aria-hidden
      />
    </>
  );
}

function HeroStatsBar({ reduced }: { reduced: boolean }) {
  const { stats } = homeContent;

  return (
    <motion.div
      {...fadeUp(0.45, reduced, 1.05)}
      className="stats-bar mx-auto w-full max-w-5xl px-5 py-4 sm:px-8 sm:py-5"
    >
      <div className="grid grid-cols-2 gap-y-4 sm:grid-cols-4 sm:gap-y-0">
        {stats.items.map((item, index) => (
          <div
            key={item.label}
            className={`text-center sm:px-3 ${
              index > 0 ? 'sm:border-l sm:border-white/[0.08]' : ''
            }`}
          >
            <AnimatedCounter
              value={item.value}
              suffix={item.suffix}
              immediate
              className="font-sans text-[clamp(1.5rem,2.5vw,2rem)] font-medium leading-none tracking-[0.04em] text-[#f5f2ed]"
            />
            <p className="hero-stat-label mt-2 text-[0.5625rem] font-medium uppercase leading-snug tracking-[0.12em] sm:text-[0.625rem]">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function HeroSection() {
  const { hero } = homeContent;
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      className="relative h-[100svh] min-h-[540px] overflow-hidden bg-[#111820] sm:min-h-[600px] lg:min-h-[620px]"
      data-header-theme="dark"
    >
      <HeroVideoBackground
        posterSrc={hero.posterSrc}
        posterFallback={hero.posterFallback}
        videoSrc={hero.videoSrc}
      />
      <HeroOverlays />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1400px] flex-col px-5 pb-3 pt-20 sm:px-8 sm:pb-4 sm:pt-24 lg:px-10">
        <div className="flex flex-1 flex-col items-center justify-center pb-6 text-center sm:pb-8">
          <motion.p {...fadeUp(0, reduced, 0.85)} className="section-label">
            ENOTEB
          </motion.p>

          <motion.h1
            {...fadeUp(0.08, reduced, 1)}
            className="enoteb-title enoteb-title--hero hero-title-serif enoteb-title--on-dark mt-4 max-w-[16ch] sm:mt-5"
          >
            {hero.title}
          </motion.h1>

          <motion.p
            {...fadeUp(0.18, reduced, 1)}
            className="enoteb-lead enoteb-lead--on-dark hero-subtitle mt-5 max-w-2xl"
          >
            {hero.subtitle}
          </motion.p>

          <motion.div
            {...fadeUp(0.28, reduced, 0.9)}
            className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-center sm:gap-3"
          >
            <Link
              href="/projets"
              className="btn-orange-solid link-focus group inline-flex w-fit items-center justify-center gap-2 rounded-none px-5 py-2.5 text-sm font-medium text-white focus-visible:ring-[#e85f14]"
            >
              {hero.primaryCta}
              <ArrowUpRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden
              />
            </Link>
            <Link
              href="/contact"
              className="link-focus inline-flex w-fit items-center justify-center rounded-none border border-white/[0.18] bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-[#f5f2ed] backdrop-blur-[8px] transition-all duration-500 ease-out hover:-translate-y-px hover:border-white/28 hover:bg-white/[0.09] hover:shadow-[0_6px_20px_-10px_rgba(0,0,0,0.35)] focus-visible:ring-white/30"
            >
              {hero.secondaryCta}
            </Link>
          </motion.div>
        </div>

        <div className="relative z-20 mt-auto w-full shrink-0 pb-1 sm:pb-2">
          <HeroStatsBar reduced={reduced} />
        </div>
      </div>
    </section>
  );
}
