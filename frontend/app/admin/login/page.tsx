import { Suspense } from 'react';
import { AdminLoginForm } from './LoginForm';

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-neutral-100 px-4">
          <p className="text-body text-neutral-700">Chargement…</p>
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
