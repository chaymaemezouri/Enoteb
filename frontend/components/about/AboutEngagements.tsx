'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { aboutContent } from '@/config/about';
import {
  AboutContainer,
  AboutLead,
  AboutSection,
  AboutTitle,
} from './AboutLayout';
import { fadeUpView, staggerItem } from './aboutMotion';

export function AboutEngagements() {
  const { engagements } = aboutContent;
  const reduced = useReducedMotion() ?? false;

  return (
    <AboutSection tone="sandSoft" aria-labelledby="about-engage-title">
      <AboutContainer>
        <motion.div {...fadeUpView(0, reduced)} className="max-w-2xl">
          <AboutTitle id="about-engage-title">{engagements.title}</AboutTitle>
          <AboutLead className="mt-4">{engagements.intro}</AboutLead>
        </motion.div>

        <div className="about-v2-shell--light about-v2-engage__shell mt-10 sm:mt-12">
          <div className="about-v2-engage__cards" role="list">
            {engagements.items.map((item, index) => (
              <motion.article
                key={item.title}
                {...staggerItem(index, reduced)}
                role="listitem"
                className="about-v2-engage__card group"
              >
                <h3 className="about-v2-engage__card-title">{item.title}</h3>
                <p className="about-v2-engage__card-text">{item.description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </AboutContainer>
    </AboutSection>
  );
}
