'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { homeContent } from '@/config/home';
import { fadeUpView, HOME_EASE, HOME_VIEWPORT } from './homeMotion';

function cardMotion(index: number, reduced: boolean) {
  return reduced
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: HOME_VIEWPORT,
        transition: {
          duration: 0.7,
          delay: 0.12 + index * 0.08,
          ease: HOME_EASE,
        },
      };
}

export function EnterpriseSection() {
  const { intro } = homeContent;
  const reduced = useReducedMotion() ?? false;
  const bodyText =
    intro.description ??
    intro.textLines.join(' ').replace(/\s+/g, ' ').trim();

  return (
    <section
      className="enterprise-section relative overflow-hidden"
      data-header-theme="dark"
      aria-labelledby="enterprise-heading"
    >
      <div className="enterprise-section__media" aria-hidden>
        <Image
          src={intro.imageSrc}
          alt=""
          fill
          className="enterprise-section__image object-cover object-center"
          sizes="100vw"
          priority={false}
        />
      </div>

      <div className="enterprise-section__overlay" aria-hidden />
      <div className="enterprise-section__grid-pattern" aria-hidden />
      <div className="enterprise-section__glow" aria-hidden />
      <div className="enterprise-section__grain intro-enterprise-noise" aria-hidden />

      <div className="enterprise-section__inner home-shell relative z-10 mx-auto w-full max-w-[76rem]">
        <div className="enterprise-section__header">
          <motion.div {...fadeUpView(0.06, reduced)} className="enterprise-section__title-col">
            <h2
              id="enterprise-heading"
              className="enterprise-section__title enoteb-title enoteb-title--on-dark"
            >
              <span className="enterprise-section__title-line">{intro.titleLines[0]}</span>
              <span className="enterprise-section__title-line enterprise-section__title-line--accent">
                {intro.titleLines[1]}
              </span>
            </h2>
          </motion.div>

          <motion.div {...fadeUpView(0.12, reduced)} className="enterprise-section__lead-col">
            <p className="enterprise-section__lead">{bodyText}</p>
          </motion.div>
        </div>

        <div className="enterprise-section__cards-wrap">
          <ul className="enterprise-section__cards" role="list">
            {intro.features.map((feature, index) => (
              <motion.li
                key={feature.title}
                role="listitem"
                {...cardMotion(index, reduced)}
                className="enterprise-card"
              >
                <span className="enterprise-card__index">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="enterprise-card__title">{feature.title}</h3>
                <p className="enterprise-card__desc">{feature.description}</p>
              </motion.li>
            ))}
          </ul>

          <motion.footer {...fadeUpView(0.36, reduced)} className="enterprise-section__foot">
            <Link
              href="/qui-sommes-nous"
              className="enterprise-section__cta link-focus group inline-flex items-center gap-2"
            >
              {intro.ctaLabel}
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </motion.footer>
        </div>
      </div>
    </section>
  );
}
