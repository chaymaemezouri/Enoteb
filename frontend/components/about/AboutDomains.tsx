'use client';

import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { aboutContent } from '@/config/about';
import { cn } from '@/lib/cn';
import { AboutContainer, AboutLead, AboutSection, AboutTitle } from './AboutLayout';
import { fadeUpView, HOME_EASE } from './aboutMotion';

type Domain = (typeof aboutContent.domains.items)[number];

function PanelContent({ item }: { item: Domain }) {
  return (
    <div className="relative z-10 p-6 sm:p-8 lg:p-10">
      <h3 className="text-xl font-semibold tracking-[-0.02em] text-[#F8F5EE] sm:text-2xl">
        {item.title}
      </h3>
      <p className="mt-3 max-w-lg text-sm leading-[1.72] text-[rgba(248,245,238,0.68)] sm:text-[0.9375rem]">
        {item.description}
      </p>
      <ul className="mt-6 space-y-2 border-t border-white/[0.08] pt-6">
        {item.bullets.map((b) => (
          <li
            key={b}
            className="text-sm leading-relaxed text-[rgba(248,245,238,0.72)]"
          >
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}

function DomainPanel({ item }: { item: Domain }) {
  return (
    <div className="about-v2-domains__panel">
      <div className="about-v2-domains__panel-bg">
        <Image
          src={item.imageSrc}
          alt=""
          fill
          className="object-cover brightness-[0.55]"
          sizes="60vw"
        />
      </div>
    </div>
  );
}

export function AboutDomains() {
  const { domains } = aboutContent;
  const reduced = useReducedMotion() ?? false;
  const [active, setActive] = useState(0);
  const [openMobile, setOpenMobile] = useState<number | null>(0);
  const current = domains.items[active] ?? domains.items[0];

  return (
    <AboutSection tone="sand" aria-labelledby="about-domains-title">
      <AboutContainer>
        <motion.div {...fadeUpView(0, reduced)} className="mb-10 max-w-2xl">
          <AboutTitle
            id="about-domains-title"
            className="text-[clamp(1.625rem,3vw,2.25rem)]"
          >
            {domains.title}
          </AboutTitle>
          <AboutLead className="mt-4">{domains.intro}</AboutLead>
        </motion.div>

        <div className="about-v2-domains__shell">
          <div className="about-v2-domains__layout hidden lg:grid lg:grid-cols-[0.34fr_0.66fr]">
            <nav
              className="about-v2-domains__nav flex flex-col justify-center border-r border-[rgba(24,33,43,0.08)] p-3"
              role="tablist"
            >
              {domains.items.map((item, index) => (
                <button
                  key={item.title}
                  type="button"
                  role="tab"
                  aria-selected={active === index}
                  onClick={() => setActive(index)}
                >
                  <span className="block text-sm font-semibold text-[#18212B]">{item.title}</span>
                </button>
              ))}
            </nav>

            <div role="tabpanel" className="relative min-h-[26rem]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.title}
                  initial={reduced ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={reduced ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.55, ease: HOME_EASE }}
                  className="absolute inset-0"
                >
                  <div className="about-v2-domains__panel h-full">
                    <div className="about-v2-domains__panel-bg">
                      <Image
                        src={current.imageSrc}
                        alt=""
                        fill
                        className="object-cover brightness-[0.5]"
                        sizes="60vw"
                      />
                    </div>
                    <PanelContent item={current} />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="about-v2-domains__mobile lg:hidden">
            {domains.items.map((item, index) => {
              const isOpen = openMobile === index;
              return (
                <div
                  key={item.title}
                  className="border-t border-[rgba(24,33,43,0.1)] first:border-t-0"
                >
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left sm:px-5"
                    onClick={() => setOpenMobile(isOpen ? null : index)}
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm font-semibold text-[#18212B]">{item.title}</span>
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 text-[#68717D] transition-transform',
                        isOpen && 'rotate-180 text-[#FF6A1A]',
                      )}
                    />
                  </button>
                  {isOpen ? (
                    <div className="relative mb-4 min-h-[18rem] overflow-hidden">
                      <DomainPanel item={item} />
                      <PanelContent item={item} />
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </AboutContainer>
    </AboutSection>
  );
}
