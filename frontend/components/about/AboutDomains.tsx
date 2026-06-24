'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { aboutContent } from '@/config/about';
import { Container } from '@/components/ui/Container';
import { SectionLabel } from '@/components/ui/SectionLabel';
import {
  ABOUT_CONTAINER,
  BG_LIGHT,
  fadeUpView,
  SECTION_PADDING,
  SQUARE_CARD,
  staggerItem,
} from './aboutMotion';

export function AboutDomains() {
  const { domains } = aboutContent;
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      className={SECTION_PADDING}
      style={{ backgroundColor: BG_LIGHT }}
      data-header-theme="light"
    >
      <Container fluid className={ABOUT_CONTAINER}>
        <motion.div {...fadeUpView(0, reduced)} className="max-w-2xl">
          <SectionLabel>{domains.overline}</SectionLabel>
          <h2 className="section-title section-title--light mt-4">{domains.title}</h2>
          <p className="section-description section-description--light mt-4">
            {domains.description}
          </p>
        </motion.div>

        <div className="mt-10 space-y-4 lg:mt-12">
          {domains.items.map((item, index) => (
            <motion.article
              key={item.title}
              {...staggerItem(index, reduced)}
              className={`grid overflow-hidden border border-[#252A30]/12 bg-white lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] ${SQUARE_CARD} ${
                index % 2 === 1 ? 'lg:[&>div:first-child]:order-2' : ''
              }`}
            >
              <div className="relative min-h-[220px] lg:min-h-[280px]">
                <Image
                  src={item.imageSrc}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#111820]/50 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#111820]/20"
                  aria-hidden
                />
              </div>

              <div className="flex flex-col justify-center p-6 sm:p-8">
                <span className="text-[0.6875rem] font-semibold tabular-nums text-[#FF6B1A]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="card-title card-title--light mt-2">{item.title}</h3>
                <p className="card-description card-description--light mt-3">{item.description}</p>
                <ul className="mt-4 space-y-2 border-t border-[#252A30]/10 pt-4">
                  {item.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex gap-2 text-[0.8125rem] leading-relaxed text-[#6B7078]"
                    >
                      <span className="mt-2 h-px w-3 shrink-0 bg-[#FF6B1A]" aria-hidden />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}
