import type { Config } from 'tailwindcss';

/**
 * Palettes disponibles (changer data-palette sur <html> dans layout.tsx) :
 *
 * A — "steel"   : Bleu acier    → industriel, confiance, corporate BTP
 * B — "safety"  : Orange sécurité → chantier, visibilité, énergie
 * C — "mineral" : Ardoise & teal  → sobre, technique, durable
 *
 * Valeur active par défaut : steel
 */
const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        surface: {
          DEFAULT: 'var(--surface)',
          muted: 'var(--surface-muted)',
          elevated: 'var(--surface-elevated)',
        },
        border: {
          DEFAULT: 'var(--border)',
          strong: 'var(--border-strong)',
        },
        neutral: {
          50: 'var(--neutral-50)',
          100: 'var(--neutral-100)',
          200: 'var(--neutral-200)',
          300: 'var(--neutral-300)',
          400: 'var(--neutral-400)',
          500: 'var(--neutral-500)',
          600: 'var(--neutral-600)',
          700: 'var(--neutral-700)',
          800: 'var(--neutral-800)',
          900: 'var(--neutral-900)',
          950: 'var(--neutral-950)',
        },
        accent: {
          50: 'var(--accent-50)',
          100: 'var(--accent-100)',
          200: 'var(--accent-200)',
          300: 'var(--accent-300)',
          400: 'var(--accent-400)',
          500: 'var(--accent-500)',
          600: 'var(--accent-600)',
          700: 'var(--accent-700)',
          800: 'var(--accent-800)',
          900: 'var(--accent-900)',
          DEFAULT: 'var(--accent-600)',
          foreground: 'var(--accent-foreground)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        display: [
          '3.5rem',
          { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' },
        ],
        h1: [
          '2.5rem',
          { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '700' },
        ],
        h2: [
          '2rem',
          { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' },
        ],
        h3: [
          '1.5rem',
          { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' },
        ],
        title: [
          '1.75rem',
          { lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '700' },
        ],
        'subtitle-lg': [
          '1.25rem',
          { lineHeight: '1.5', fontWeight: '500' },
        ],
        subtitle: [
          '1.125rem',
          { lineHeight: '1.5', fontWeight: '500' },
        ],
        body: ['1rem', { lineHeight: '1.75', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.6', fontWeight: '400' }],
        caption: ['0.75rem', { lineHeight: '1.5', fontWeight: '500' }],
        overline: [
          '0.75rem',
          {
            lineHeight: '1.5',
            fontWeight: '600',
            letterSpacing: '0.08em',
          },
        ],
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        30: '7.5rem',
        section: '5rem',
        'section-sm': '3rem',
        'section-lg': '7rem',
      },
      maxWidth: {
        container: '76rem',
      },
      borderRadius: {
        card: '0.75rem',
        button: '0.5rem',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(15 23 42 / 0.06), 0 1px 2px -1px rgb(15 23 42 / 0.06)',
        'card-hover':
          '0 10px 25px -5px rgb(15 23 42 / 0.08), 0 4px 6px -4px rgb(15 23 42 / 0.06)',
        header: '0 1px 0 0 var(--border)',
      },
      transitionDuration: {
        DEFAULT: '200ms',
      },
    },
  },
  plugins: [],
};

export default config;
