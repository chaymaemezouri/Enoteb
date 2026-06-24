'use client';

import Image from 'next/image';
import { Building2, Users } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { aboutContent } from '@/config/about';
import { Container } from '@/components/ui/Container';
import { SectionLabel } from '@/components/ui/SectionLabel';
import {
  ABOUT_CONTAINER,
  BG_WHITE,
  fadeUpView,
  SECTION_PADDING,
  SQUARE_CARD,
  staggerItem,
} from './aboutMotion';

const pillarIcons = [Users, Building2] as const;

export function AboutIntro() {
  const { introduction, entreprise } = aboutContent;
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      className={SECTION_PADDING}
      style={{ backgroundColor: BG_WHITE }}
      data-header-theme="light"
    >
      <Container fluid className={ABOUT_CONTAINER}>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14 lg:items-start">
          <motion.div {...fadeUpView(0, reduced)}>
            <SectionLabel>{entreprise.overline}</SectionLabel>
            <h2 className="section-title section-title--light mt-4">{entreprise.title}</h2>

            <div className="mt-5 space-y-4">
              {introduction.paragraphs.map((p) => (
                <p key={p.slice(0, 40)} className="section-description section-description--light">
                  {p}
                </p>
              ))}
            </div>

            <div className="mt-6 space-y-4 border-t border-[#252A30]/10 pt-6">
              {entreprise.paragraphs.map((p) => (
                <p key={p.slice(0, 40)} className="card-description card-description--light">
                  {p}
                </p>
              ))}
            </div>
          </motion.div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <motion.div
              {...fadeUpView(0.08, reduced)}
              className={`relative aspect-[4/5] overflow-hidden border border-[#252A30]/12 ${SQUARE_CARD}`}
            >
              <Image
                src={entreprise.imageSrc}
                alt={entreprise.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </motion.div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
              {entreprise.pillars.map((pillar, index) => {
                const Icon = pillarIcons[index] ?? Users;
                return (
                  <motion.div
                    key={pillar.title}
                    {...staggerItem(index, reduced)}
                    className={`border border-[#252A30]/12 bg-[#F5F2EC] p-5 ${SQUARE_CARD}`}
                  >
                    <div className="flex h-9 w-9 items-center justify-center border border-[#FF6B1A]/30 bg-white text-[#FF6B1A]">
                      <Icon className="h-4 w-4" aria-hidden />
                    </div>
                    <h3 className="card-title card-title--light mt-4 text-base">{pillar.title}</h3>
                    <p className="card-description card-description--light mt-2 text-sm">
                      {pillar.description}
                    </p>
                  </motion.div>
                );
              })}

              <motion.div
                {...staggerItem(2, reduced)}
                className={`flex flex-col justify-center border border-[#252A30]/12 bg-[#111820] p-5 sm:col-span-2 lg:col-span-2 ${SQUARE_CARD}`}
              >
                <p className="stat-number text-[#FF6B1A]">
                  {entreprise.experienceStat.value}
                  {entreprise.experienceStat.suffix}
                </p>
                <p className="stat-label stat-label--dark mt-2 uppercase tracking-[0.14em]">
                  {entreprise.experienceStat.label}
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
