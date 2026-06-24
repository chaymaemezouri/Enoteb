'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { aboutContent } from '@/config/about';
import { homeContent } from '@/config/home';
import { Container } from '@/components/ui/Container';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ABOUT_CONTAINER, BG_LIGHT, fadeUpView, SECTION_PADDING, SQUARE_CARD, staggerItem } from './aboutMotion';

export function AboutClients() {
  const { clients } = aboutContent;
  const partners = homeContent.partners.items;
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      className={SECTION_PADDING}
      style={{ backgroundColor: BG_LIGHT }}
      data-header-theme="light"
    >
      <Container fluid className={ABOUT_CONTAINER}>
        <motion.div {...fadeUpView(0, reduced)} className="max-w-2xl">
          <SectionLabel>{clients.overline}</SectionLabel>
          <h2 className="section-title section-title--light mt-4">{clients.title}</h2>
          <p className="section-description section-description--light mt-4">
            {clients.description}
          </p>
        </motion.div>

        <div className="mt-8 flex flex-wrap gap-2 sm:mt-10">
          {clients.names.map((name, index) => (
            <motion.span
              key={name}
              {...staggerItem(index * 0.5, reduced)}
              className={`border border-[#252A30]/12 bg-white px-3 py-2 text-[0.8125rem] text-[#252A30]/80 ${SQUARE_CARD}`}
            >
              {name}
            </motion.span>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 border-t border-[#252A30]/10 pt-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {partners.slice(0, 10).map((partner, index) => (
            <motion.div
              key={partner.name}
              {...staggerItem(index, reduced)}
              className={`flex h-16 items-center justify-center border border-[#252A30]/12 bg-white px-4 sm:h-[4.5rem] ${SQUARE_CARD}`}
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                width={120}
                height={40}
                className="h-7 w-auto max-w-[6.5rem] object-contain opacity-80"
              />
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
