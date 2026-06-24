import { MessageCircle } from 'lucide-react';
import { getWhatsAppUrl } from '@/lib/contact';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Card } from '@/components/ui/Card';

export function ContactWhatsApp() {
  const whatsappUrl = getWhatsAppUrl('Bonjour, je souhaite vous contacter via le site ENOTEB.');

  if (!whatsappUrl) {
    return null;
  }

  return (
    <Card
      variant="muted"
      padding="lg"
      className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#25D366]/15 text-[#25D366]">
          <MessageCircle className="h-6 w-6" aria-hidden />
        </div>
        <div>
          <h2 className="text-subtitle text-neutral-900">WhatsApp</h2>
          <p className="mt-1 text-body-sm text-neutral-600">
            Écrivez-nous directement avec un message prérempli.
          </p>
        </div>
      </div>

      <ButtonLink
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-[#25D366] text-white hover:bg-[#1ebe57] sm:w-auto"
      >
        Ouvrir WhatsApp
      </ButtonLink>
    </Card>
  );
}
