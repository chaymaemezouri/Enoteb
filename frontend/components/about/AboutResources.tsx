'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { aboutContent } from '@/config/about';
import { AboutContainer, AboutLabel, AboutSection, AboutTitle } from './AboutLayout';
import { fadeUpView } from './aboutMotion';

function ResourceBand({
  title,
  summary,
  points,
  imageSrc,
  imageAlt,
  delay,
  reduced,
}: {
  title: string;
  summary: string;
  points: readonly string[];
  imageSrc: string;
  imageAlt: string;
  delay: number;
  reduced: boolean;
}) {
  return (
    <motion.article {...fadeUpView(delay, reduced)} className="about-v2-resource">
      <div className="about-v2-resource__visual relative">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover object-center"
          sizes="(max-width: 1023px) 100vw, 42vw"
        />
        <div className="about-v2-resource__visual-shade" aria-hidden />
      </div>
      <div className="about-v2-resource__body">
        <h3 className="enoteb-title text-[clamp(1.375rem,2.4vw,1.75rem)] enoteb-title--on-dark">
          {title}
        </h3>
        <p className="mt-4 max-w-xl text-sm leading-[1.75] text-[rgba(248,245,238,0.58)] sm:text-[0.9375rem]">
          {summary}
        </p>
        <ul className="mt-6 space-y-2.5 sm:mt-7">
          {points.map((point) => (
            <li
              key={point}
              className="text-sm font-medium text-[rgba(248,245,238,0.8)]"
            >
              {point}
            </li>
          ))}
        </ul>
      </div>
    </motion.article>
  );
}

export function AboutResources() {
  const { humanCapital, equipment, resources } = aboutContent;
  const reduced = useReducedMotion() ?? false;

  return (
    <AboutSection tone="dark" aria-label="Capital humain et moyens matériels">
      <AboutContainer>
        <motion.header {...fadeUpView(0, reduced)} className="mb-10 max-w-2xl sm:mb-12 lg:mb-14">
          <AboutLabel light>{resources.overline}</AboutLabel>
          <AboutTitle light className="mt-5 text-[clamp(1.625rem,3vw,2.25rem)]">
            {resources.title}
          </AboutTitle>
        </motion.header>

        <div className="about-v2-resources__shell">
          <ResourceBand
            title={humanCapital.title}
            summary={humanCapital.summary}
            points={humanCapital.points}
            imageSrc={humanCapital.imageSrc}
            imageAlt={humanCapital.imageAlt}
            delay={0.06}
            reduced={reduced}
          />
          <ResourceBand
            title={equipment.title}
            summary={equipment.summary}
            points={equipment.highlights}
            imageSrc={equipment.imageSrc}
            imageAlt={equipment.imageAlt}
            delay={0.12}
            reduced={reduced}
          />
        </div>
      </AboutContainer>
    </AboutSection>
  );
}
