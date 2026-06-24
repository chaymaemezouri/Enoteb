import { MessageCircle } from 'lucide-react';
import { getWhatsAppUrl } from '@/lib/contact';
import { cn } from '@/lib/cn';

export interface WhatsAppButtonProps {
  className?: string;
}

export function WhatsAppButton({ className }: WhatsAppButtonProps) {
  const whatsappUrl = getWhatsAppUrl();

  if (!whatsappUrl) {
    return null;
  }

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-shadow duration-200 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 motion-safe:hover:scale-105',
        className,
      )}
      aria-label="Nous contacter sur WhatsApp"
    >
      <MessageCircle className="h-7 w-7" aria-hidden />
    </a>
  );
}
