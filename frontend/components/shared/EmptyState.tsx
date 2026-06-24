import { FolderOpen } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/cn';

interface EmptyStateProps {
  title: string;
  description: string;
  className?: string;
}

export function EmptyState({ title, description, className }: EmptyStateProps) {
  return (
    <Card variant="muted" className={cn('flex flex-col items-center py-12 text-center', className)}>
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-200 text-neutral-500">
        <FolderOpen className="h-7 w-7" aria-hidden />
      </div>
      <h3 className="mt-4 text-subtitle text-neutral-900">{title}</h3>
      <p className="mt-2 max-w-md text-body-sm text-neutral-600">{description}</p>
    </Card>
  );
}
