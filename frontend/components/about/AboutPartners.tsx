'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { homeContent } from '@/config/home';
import { aboutContent } from '@/config/about';
import { AboutContainer, AboutLead, AboutSection, AboutTitle } from './AboutLayout';
import { fadeUpView, staggerItem } from './aboutMotion';

function PartnerLogo({ name, logo }: { name: string; logo: string }) {
  return (
    <div className="about-v2-partners__logo">
      <Image
        src={logo}
        alt={name}
        width={180}
        height={64}
        className="about-v2-partners__logo-img"
      />
    </div>
  );
}

export function AboutPartners() {
  const { clients } = aboutContent;
  const { partners } = homeContent;
  const reduced = useReducedMotion() ?? false;

  return (
    <AboutSection tone="deep" aria-labelledby="about-partners-title">
      <AboutContainer>
        <motion.div {...fadeUpView(0, reduced)} className="max-w-2xl">
          <AboutTitle
            light
            id="about-partners-title"
            className="text-[clamp(1.375rem,2.4vw,1.875rem)]"
          >
            <span className="text-[#FF6A1A]">{clients.titleAccent}</span>{' '}
            {clients.titleBody}
          </AboutTitle>
          <AboutLead light className="mt-4 max-w-xl">
            {clients.description}
          </AboutLead>
        </motion.div>

        <div className="about-v2-shell--dark about-v2-partners__shell">
          <ul className="about-v2-partners__logos" role="list">
            {partners.items.map((partner, index) => (
              <motion.li
                key={partner.name}
                {...staggerItem(index, reduced)}
                role="listitem"
                className="list-none"
              >
                <PartnerLogo name={partner.name} logo={partner.logo} />
              </motion.li>
            ))}
          </ul>
        </div>
      </AboutContainer>
    </AboutSection>
  );
}
