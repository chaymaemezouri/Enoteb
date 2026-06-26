'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { homeContent } from '@/config/home';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { fadeUpView, HOME_EASE, HOME_VIEWPORT } from './homeMotion';

function pillarMotion(index: number, reduced: boolean) {
  return reduced
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        whileInView: { opacity: 1, y: 0 },
        viewport: HOME_VIEWPORT,
        transition: {
          duration: 0.8,
          delay: 0.28 + index * 0.12,
          ease: HOME_EASE,
        },
      };
}

export function EnterpriseSection() {
  const { intro } = homeContent;
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      className="enterprise-section relative overflow-hidden"
      data-header-theme="dark"
      aria-labelledby="enterprise-heading"
    >
      <div className="enterprise-section__base" aria-hidden />
      <div className="enterprise-section__top-fade" aria-hidden />
      <div className="enterprise-section__glow" aria-hidden />
      <div className="enterprise-section__grain intro-enterprise-noise" aria-hidden />

      <div className="enterprise-section__image-rail" aria-hidden>
        <Image
          src={intro.imageSrc}
          alt=""
          fill
          className="enterprise-section__image object-cover object-[62%_38%]"
          sizes="(min-width: 1024px) 58vw, 100vw"
          priority={false}
        />
        <div className="enterprise-section__image-overlay" />
      </div>

      <div className="enterprise-section__inner relative z-10 w-full">
        <div className="enterprise-section__grid">
          <div className="enterprise-section__copy">
            <motion.div {...fadeUpView(0, reduced)}>
              <SectionLabel>{intro.overline}</SectionLabel>
            </motion.div>

            <motion.h2
              {...fadeUpView(0.1, reduced)}
              id="enterprise-heading"
              className="enterprise-section__title"
            >
              {intro.titleLines.map((line) => (
                <span key={line} className="enterprise-section__title-line">
                  {line}
                </span>
              ))}
            </motion.h2>

            <motion.p {...fadeUpView(0.2, reduced)} className="enterprise-section__text">
              {intro.textLines.map((line) => (
                <span key={line} className="enterprise-section__text-line">
                  {line}
                </span>
              ))}
            </motion.p>
          </div>

          <div className="enterprise-section__pillars">
            {intro.features.map((feature, index) => (
              <motion.article
                key={feature.title}
                {...pillarMotion(index, reduced)}
                className={`enterprise-pillar ${index > 0 ? 'enterprise-pillar--border' : ''}`}
              >
                <span className="enterprise-pillar__index">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="enterprise-pillar__body">
                  <h3 className="enterprise-pillar__title">{feature.title}</h3>
                  <p className="enterprise-pillar__desc">{feature.description}</p>
                </div>
              </motion.article>
            ))}

            <motion.div {...fadeUpView(0.55, reduced)} className="enterprise-section__pillars-foot">
              <Link
                href="/qui-sommes-nous"
                className="enterprise-section__cta link-focus group inline-flex shrink-0 items-center gap-2"
              >
                {intro.ctaLabel}
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
