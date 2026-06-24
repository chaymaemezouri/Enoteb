import Link from 'next/link';

export function SkipLink() {
  return (
    <Link
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-button focus:bg-accent focus:px-4 focus:py-3 focus:text-body-sm focus:font-medium focus:text-accent-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-accent"
    >
      Aller au contenu principal
    </Link>
  );
}
