'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { contactPageContent } from '@/config/contact';
import { fadeUpView } from './contactMotion';

export function ContactHero() {
  const { hero } = contactPageContent;
  const reduced = useReducedMotion() ?? false;

  return (
    <section className="contact-hero" data-header-theme="dark">
      <Image
        src={hero.image}
        alt={hero.imageAlt}
        fill
        priority
        sizes="100vw"
        className="contact-hero__image"
      />
      <div className="contact-hero__overlay" aria-hidden />

      <motion.div {...fadeUpView(0, reduced)} className="contact-hero__content home-shell w-full">
        <h1 className="contact-hero__title">{hero.title}</h1>
        <p className="contact-hero__description">{hero.description}</p>
      </motion.div>
    </section>
  );
}
