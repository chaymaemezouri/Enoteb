'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { formatAdminError } from '@/lib/admin-utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Logo } from '@/components/layout/Logo';

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
      <div className="flex min-h-screen items-center justify-center bg-neutral-100 px-4">
        <p className="text-body text-neutral-700">Vérification de la session…</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 px-4 py-10">
      <div className="w-full max-w-md rounded-card border border-neutral-200 bg-white p-8 shadow-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo size="lg" className="mb-4" />
          <p className="text-body-sm font-medium text-neutral-500">Espace sécurisé</p>
          <h1 className="mt-1 text-title text-neutral-900">Connexion</h1>
          <p className="mt-2 text-body text-neutral-600">
            Utilisez vos identifiants pour accéder à l’administration du site.
          </p>
        </div>

        <form onSubmit={(event) => void handleSubmit(event)} className="space-y-5">
          {error ? (
            <div
              role="alert"
              className="rounded-button border border-red-200 bg-red-50 px-4 py-3 text-body text-red-700"
            >
              {error}
            </div>
          ) : null}

          <div>
            <Label htmlFor="admin-email" required>
              Adresse email
            </Label>
            <Input
              id="admin-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="admin-password" required>
              Mot de passe
            </Label>
            <Input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Connexion en cours…' : 'Se connecter'}
          </Button>
        </form>
      </div>
    </div>
  );
}
