'use client';

import { AdminAuthGate, AdminShell, ProjectForm } from '@/components/admin';

interface EditProjectPageProps {
  params: { id: string };
}

export default function AdminEditProjectPage({ params }: EditProjectPageProps) {
  return (
    <AdminAuthGate>
      <AdminShell>
        <ProjectForm mode="edit" projectId={params.id} />
      </AdminShell>
    </AdminAuthGate>
  );
}
