'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { siteConfig } from '@/config/site';
import { formatAdminError } from '@/lib/admin-utils';

function AdminLoginShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-login-page">
      <div className="admin-login-page__sand" aria-hidden />
      <div className="admin-login-page__grid" aria-hidden />
      <div className="admin-login-page__inner">{children}</div>
    </div>
  );
}

export function AdminLoginForm() {
  const { login, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const redirect = searchParams.get('redirect');
      router.replace(redirect?.startsWith('/admin') ? redirect : '/admin/dashboard');
    }
  }, [isAuthenticated, isLoading, router, searchParams]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Veuillez saisir votre email et votre mot de passe.');
      return;
    }

    setIsSubmitting(true);

    try {
      await login(email.trim(), password);
      const redirect = searchParams.get('redirect');
      router.replace(redirect?.startsWith('/admin') ? redirect : '/admin/dashboard');
    } catch (submitError) {
      setError(formatAdminError(submitError));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <AdminLoginShell>
        <p className="admin-login-page__loading">Vérification de la session…</p>
      </AdminLoginShell>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <AdminLoginShell>
      <div className="admin-login-page__shell">
        <aside className="admin-login-page__brand">
          <span className="admin-login-page__brand-accent" aria-hidden />
          <Link href="/" className="link-focus inline-flex w-fit" aria-label={`${siteConfig.name} — Accueil`}>
            <Image
              src={siteConfig.logo.src}
              alt=""
              width={144}
              height={48}
              className="admin-login-page__brand-logo"
              priority
            />
          </Link>
          <div>
            <p className="admin-login-page__brand-label">Espace sécurisé</p>
            <h1 className="admin-login-page__brand-title mt-3">Administration ENOTEB</h1>
            <p className="admin-login-page__brand-text mt-3">
              Gérez les projets, secteurs et contenus du site public depuis un espace dédié.
            </p>
          </div>
        </aside>

        <div className="admin-login-page__form-wrap">
          <div>
            <p className="admin-login-page__brand-label">Connexion</p>
            <h2 className="admin-login-page__form-title mt-2">Identifiants</h2>
            <p className="admin-login-page__form-lead">
              Utilisez votre compte administrateur pour continuer.
            </p>
          </div>

          <form onSubmit={(event) => void handleSubmit(event)} className="admin-login-page__form">
            {error ? (
              <div role="alert" className="admin-login-page__alert">
                {error}
              </div>
            ) : null}

            <div className="admin-login-page__field">
              <label htmlFor="admin-email" className="admin-login-page__label admin-login-page__label-required">
                Adresse email
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="admin-login-page__input"
                placeholder={siteConfig.contact.email}
              />
            </div>

            <div className="admin-login-page__field">
              <label htmlFor="admin-password" className="admin-login-page__label admin-login-page__label-required">
                Mot de passe
              </label>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="admin-login-page__input"
              />
            </div>

            <button type="submit" className="admin-login-page__submit" disabled={isSubmitting}>
              {isSubmitting ? 'Connexion en cours…' : 'Se connecter'}
              {!isSubmitting ? <ArrowRight className="h-4 w-4" aria-hidden /> : null}
            </button>
          </form>
        </div>
      </div>

      <Link href="/" className="admin-login-page__back link-focus">
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
        Retour au site
      </Link>
    </AdminLoginShell>
  );
}
