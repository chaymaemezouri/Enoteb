export const HOME_EASE = [0.22, 1, 0.36, 1] as const;
export const HOME_VIEWPORT = { once: true, amount: 0.15 as const };

/** Padding vertical harmonisé des sections landing */
export const SECTION_PADDING = 'py-14 sm:py-16 lg:py-20';
export function fadeUpView(delay: number, reduced: boolean) {
  return reduced
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        whileInView: { opacity: 1, y: 0 },
        viewport: HOME_VIEWPORT,
        transition: { duration: 0.75, delay, ease: HOME_EASE },
      };
}

export function staggerItem(index: number, reduced: boolean) {
  return reduced
    ? {}
    : {
        initial: { opacity: 0, y: 14 },
        whileInView: { opacity: 1, y: 0 },
        viewport: HOME_VIEWPORT,
        transition: { duration: 0.65, delay: index * 0.04, ease: HOME_EASE },
      };
}
