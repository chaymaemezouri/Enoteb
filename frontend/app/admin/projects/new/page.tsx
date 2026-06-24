'use client';

import { AdminAuthGate, AdminShell, ProjectForm } from '@/components/admin';

export default function AdminNewProjectPage() {
  return (
    <AdminAuthGate>
      <AdminShell>
        <ProjectForm mode="create" />
      </AdminShell>
    </AdminAuthGate>
  );
}
