'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { aboutContent } from '@/config/about';
import { ABOUT_SHELL } from './AboutLayout';
import { HOME_EASE } from './aboutMotion';

const EASE = HOME_EASE;

export function AboutHero() {
  const { hero } = aboutContent;
  const reduced = useReducedMotion() ?? false;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, 40]);
  const scale = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [1, 1.05]);

  const accentIndex = hero.titleLines[1]?.indexOf(hero.titleAccent) ?? -1;

  return (
    <section
      ref={ref}
      className="about-v2-hero relative flex min-h-[min(84vh,780px)] flex-col justify-end overflow-hidden bg-[#071018] pt-28 sm:min-h-[min(88vh,840px)] lg:min-h-[min(90vh,880px)]"
      data-header-theme="dark"
    >
      <motion.div
        className="about-v2-hero__media absolute inset-0 z-0"
        style={{ y, scale }}
        aria-hidden
      >
        <Image
          src={hero.imageSrc}
          alt={hero.imageAlt}
          fill
          priority
          quality={92}
          className="about-v2-hero__image"
          sizes="100vw"
        />
      </motion.div>

      <div className="about-v2-hero__shade absolute inset-0 z-[1]" aria-hidden />
      <div className="about-v2-hero__veil absolute inset-0 z-[1]" aria-hidden />
      <div className="about-v2-hero__bottom-fade absolute inset-x-0 bottom-0 z-[2]" aria-hidden />

      <div
        className={`about-v2-hero__container relative z-10 flex flex-1 flex-col justify-end ${ABOUT_SHELL} px-6 pb-12 sm:px-6 sm:pb-14 lg:px-8 lg:pb-16`}
      >
        <div className="about-v2-hero__grid pb-2 pt-16 sm:pt-20 lg:pt-24">
          <div className="about-v2-hero__content min-w-0">
            <span className="about-v2-hero__accent-bar" aria-hidden />

            <motion.p
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE }}
              className="section-label"
            >
              {hero.overline}
            </motion.p>

            <motion.h1
              initial={reduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
              className="enoteb-title enoteb-title--hero hero-title-serif enoteb-title--on-dark about-v2-hero__title mt-5 sm:mt-6"
            >
              <span className="about-v2-hero__title-line block">{hero.titleLines[0]}</span>
              <span className="about-v2-hero__title-line mt-1 block sm:mt-1.5">
                {accentIndex >= 0 ? (
                  <>
                    {hero.titleLines[1]!.slice(0, accentIndex)}
                    <span className="text-[#FF6A1A]">{hero.titleAccent}</span>
                    {hero.titleLines[1]!.slice(accentIndex + hero.titleAccent.length)}
                  </>
                ) : (
                  hero.titleLines[1]
                )}
              </span>
            </motion.h1>

            <motion.p
              initial={reduced ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.22, ease: EASE }}
              className="enoteb-lead enoteb-lead--on-dark about-v2-hero__lead mt-6 max-w-xl sm:mt-7"
            >
              {hero.description}
            </motion.p>

            <motion.div
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.34, ease: EASE }}
              className="about-v2-hero__actions mt-8 flex flex-wrap items-center gap-4 sm:mt-9"
            >
              <Link href="#notre-histoire" className="about-v2-hero__cta btn-orange-glass link-focus rounded-none group">
                <span>Notre histoire</span>
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
              <Link href="/contact" className="about-v2-hero__cta-secondary link-focus rounded-none">
                Nous contacter
              </Link>
            </motion.div>
          </div>

          <motion.aside
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.28, ease: EASE }}
            className="about-v2-hero__aside hidden lg:block"
          >
            <p className="about-v2-hero__aside-label">Expertise terrain</p>
            <p className="about-v2-hero__aside-text">
              BTP, aménagement et construction industrielle au service des marchés publics et privés.
            </p>
            <p className="about-v2-hero__aside-meta">Laâyoune · Maroc</p>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
