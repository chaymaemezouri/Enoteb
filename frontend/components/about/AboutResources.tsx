'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { aboutContent } from '@/config/about';
import { cn } from '@/lib/cn';
import { AboutContainer, AboutSection, AboutTitle } from './AboutLayout';
import { fadeUpView, staggerItem } from './aboutMotion';

type ResourceItem = {
  title: string;
  summary: string;
  points: readonly string[];
  imageSrc: string;
  imageAlt: string;
};

function ResourceCard({
  item,
  index,
  reduced,
  reversed,
}: {
  item: ResourceItem;
  index: number;
  reduced: boolean;
  reversed?: boolean;
}) {
  const number = String(index + 1).padStart(2, '0');

  return (
    <motion.article
      {...staggerItem(index, reduced)}
      className={cn(
        'about-v2-resources__card group',
        reversed && 'about-v2-resources__card--reverse',
      )}
    >
      <div className="about-v2-resources__visual">
        <Image
          src={item.imageSrc}
          alt={item.imageAlt}
          fill
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          sizes="(max-width: 767px) 100vw, 44vw"
        />
        <div className="about-v2-resources__visual-shade" aria-hidden />
      </div>

      <div className="about-v2-resources__content">
        <span className="about-v2-resources__index" aria-hidden>
          {number}
        </span>

        <h3 className="about-v2-resources__title">{item.title}</h3>
        <p className="about-v2-resources__summary">{item.summary}</p>
        <p className="about-v2-resources__points">{item.points.join(' · ')}</p>
      </div>
    </motion.article>
  );
}

export function AboutResources() {
  const { humanCapital, equipment, resources } = aboutContent;
  const reduced = useReducedMotion() ?? false;

  const items: ResourceItem[] = [
    {
      title: humanCapital.title,
      summary: humanCapital.summary,
      points: humanCapital.points,
      imageSrc: humanCapital.imageSrc,
      imageAlt: humanCapital.imageAlt,
    },
    {
      title: equipment.title,
      summary: equipment.summary,
      points: equipment.highlights,
      imageSrc: equipment.imageSrc,
      imageAlt: equipment.imageAlt,
    },
  ];

  return (
    <AboutSection
      tone="deep"
      className="about-v2-resources-section"
      aria-labelledby="about-resources-title"
    >
      <AboutContainer compact>
        <motion.header {...fadeUpView(0, reduced)} className="about-v2-resources__header max-w-2xl">
          <AboutTitle
            light
            id="about-resources-title"
            className="text-[clamp(1.625rem,3vw,2.25rem)]"
          >
            {resources.title}
          </AboutTitle>
        </motion.header>

        <div className="about-v2-resources__stack" role="list">
          {items.map((item, index) => (
            <ResourceCard
              key={item.title}
              item={item}
              index={index}
              reduced={reduced}
              reversed={index % 2 === 1}
            />
          ))}
        </div>
      </AboutContainer>
    </AboutSection>
  );
}
