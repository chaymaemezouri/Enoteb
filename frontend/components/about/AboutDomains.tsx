'use client';

import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useState, type ReactNode } from 'react';
import { aboutContent } from '@/config/about';
import { cn } from '@/lib/cn';
import { AboutContainer, AboutLead, AboutSection, AboutTitle } from './AboutLayout';
import { fadeUpView, HOME_EASE } from './aboutMotion';

type Domain = (typeof aboutContent.domains.items)[number];

function PanelContent({ item, compact = false }: { item: Domain; compact?: boolean }) {
  return (
    <div
      className={cn(
        'about-v2-domains__panel-content relative z-10',
        compact ? 'p-5' : 'p-6 sm:p-8 lg:p-10',
      )}
    >
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

function DomainPanel({
  item,
  children,
  compact = false,
}: {
  item: Domain;
  children?: ReactNode;
  compact?: boolean;
}) {
  return (
    <div className={cn('about-v2-domains__panel', compact && 'about-v2-domains__panel--compact')}>
      <div className="about-v2-domains__panel-bg">
        <Image
          src={item.imageSrc}
          alt=""
          fill
          className="object-cover brightness-[0.55]"
          sizes={compact ? '(max-width: 1023px) 100vw, 60vw' : '60vw'}
        />
      </div>
      {children}
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
      <AboutContainer className="about-v2-domains__container">
        <motion.div {...fadeUpView(0, reduced)} className="about-v2-domains__intro">
          <AboutTitle id="about-domains-title">{domains.title}</AboutTitle>
          <AboutLead className="about-v2-domains__intro-lead">{domains.intro}</AboutLead>
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
                <div key={item.title} className="about-v2-domains__mobile-item">
                  <button
                    type="button"
                    className={cn(
                      'about-v2-domains__mobile-trigger',
                      isOpen && 'about-v2-domains__mobile-trigger--open',
                    )}
                    onClick={() => setOpenMobile(isOpen ? null : index)}
                    aria-expanded={isOpen}
                  >
                    <span className="about-v2-domains__mobile-trigger-label">{item.title}</span>
                    <ChevronDown
                      className={cn(
                        'about-v2-domains__mobile-trigger-icon',
                        isOpen && 'about-v2-domains__mobile-trigger-icon--open',
                      )}
                      aria-hidden
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        key={item.title}
                        initial={reduced ? false : { height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={reduced ? undefined : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: HOME_EASE }}
                        className="about-v2-domains__mobile-panel-wrap overflow-hidden"
                      >
                        <div className="about-v2-domains__mobile-panel">
                          <DomainPanel item={item} compact>
                            <PanelContent item={item} compact />
                          </DomainPanel>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </AboutContainer>
    </AboutSection>
  );
}
