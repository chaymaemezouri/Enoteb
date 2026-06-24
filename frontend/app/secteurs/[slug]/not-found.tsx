import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { ButtonLink } from '@/components/ui/ButtonLink';

export default function SectorNotFound() {
  return (
    <section className="py-section-sm lg:py-section">
      <Container className="text-center">
        <h1 className="text-h1 text-neutral-900">Secteur introuvable</h1>
        <p className="mx-auto mt-4 max-w-lg text-body text-neutral-600">
          Le secteur demandé n’existe pas ou n’est plus disponible.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <ButtonLink href="/secteurs">Voir tous les secteurs</ButtonLink>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center px-5 text-body font-medium text-accent hover:text-accent-700"
          >
            Retour à l’accueil
          </Link>
        </div>
      </Container>
    </section>
  );
}
