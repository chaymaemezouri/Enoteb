import { Suspense } from 'react';
import { AdminLoginForm } from './LoginForm';

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="admin-login-page">
          <div className="admin-login-page__sand" aria-hidden />
          <div className="admin-login-page__grid" aria-hidden />
          <div className="admin-login-page__inner">
            <p className="admin-login-page__loading">Chargement…</p>
          </div>
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
