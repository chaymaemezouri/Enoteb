'use client';

import { useEffect, useState } from 'react';

export type HeaderTheme = 'dark' | 'light';

const HEADER_OFFSET = 72;
const SCROLL_COMPACT_THRESHOLD = 24;

function getProbeY() {
  return window.scrollY + HEADER_OFFSET;
}

function getSectionBounds(section: HTMLElement) {
  const rect = section.getBoundingClientRect();
  const top = rect.top + window.scrollY;
  const bottom = top + rect.height;
  return { top, bottom };
}

function findActiveSection(
  sections: HTMLElement[],
  probe: number,
): HTMLElement | null {
  for (const section of sections) {
    const { top, bottom } = getSectionBounds(section);
    if (probe >= top && probe < bottom) {
      return section;
    }
  }

  let last: HTMLElement | null = null;
  for (const section of sections) {
    const { top } = getSectionBounds(section);
    if (probe >= top) {
      last = section;
    }
  }

  return last;
}

export function useHeaderTheme(enabled: boolean) {
  const [theme, setTheme] = useState<HeaderTheme>('dark');
  const [scrolled, setScrolled] = useState(false);
  const [hideLogo, setHideLogo] = useState(false);

  useEffect(() => {
    function update() {
      const probe = getProbeY();
      setScrolled(window.scrollY > SCROLL_COMPACT_THRESHOLD);

      const hideSections = document.querySelectorAll<HTMLElement>('[data-hide-navbar-logo]');
      const hideMatch = findActiveSection(Array.from(hideSections), probe);
      setHideLogo(Boolean(hideMatch));

      if (!enabled) {
        setTheme('dark');
        return;
      }

      const themeSections = document.querySelectorAll<HTMLElement>('[data-header-theme]');
      if (!themeSections.length) {
        setTheme('dark');
        return;
      }

      const themeMatch = findActiveSection(Array.from(themeSections), probe);
      setTheme((themeMatch?.dataset.headerTheme as HeaderTheme) ?? 'dark');
    }

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [enabled]);

  return { theme, scrolled, hideLogo };
}
