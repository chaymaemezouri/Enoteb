import { WhatsAppIcon } from '@/components/icons/SocialIcons';
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
        'whatsapp-fab link-focus fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-50 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-[#18212B] text-white shadow-[0_8px_24px_-12px_rgba(7,16,24,0.65)] transition-[border-color,box-shadow,transform] duration-300 hover:border-[#FF6A1A]/35 hover:shadow-[0_10px_28px_-10px_rgba(7,16,24,0.75)] motion-safe:hover:-translate-y-0.5',
        className,
      )}
      aria-label="Nous contacter sur WhatsApp"
    >
      <WhatsAppIcon className="h-[1.125rem] w-[1.125rem]" />
    </a>
  );
}
