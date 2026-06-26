'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  Clock,
  KeyRound,
  Lock,
  Mail,
  Shield,
  ShieldCheck,
  User,
} from 'lucide-react';
import { AdminAuthGate, AdminPageHeader, AdminShell, ProfileAvatarField, useAdminToast } from '@/components/admin';
import { useAuth } from '@/contexts/AuthContext';
import { changePasswordRequest, updateProfileRequest } from '@/lib/auth-api';
import { formatAdminDate, formatAdminError } from '@/lib/admin-utils';

const securityTips = [
  'Au moins 8 caractères',
  'Mot de passe unique pour cet espace',
  'Ne partagez jamais vos identifiants',
];

export default function AdminSettingsPage() {
  const { accessToken, profile, refreshProfile } = useAuth();
  const { showToast } = useAdminToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [profileError, setProfileError] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setEmail(profile.email);
      setAvatarUrl(profile.avatarUrl ?? '');
    }
  }, [profile]);

  const profileDirty = useMemo(() => {
    if (!profile) {
      return false;
    }

    return (
      name.trim() !== profile.name ||
      email.trim().toLowerCase() !== profile.email.toLowerCase() ||
      avatarUrl !== (profile.avatarUrl ?? '')
    );
  }, [profile, name, email, avatarUrl]);

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProfileError(null);

    if (!name.trim()) {
      setProfileError('Le nom est obligatoire.');
      return;
    }

    if (!accessToken) {
      setProfileError('Votre session a expiré. Reconnectez-vous.');
      return;
    }

    setIsSavingProfile(true);

    try {
      await updateProfileRequest(accessToken, {
        name: name.trim(),
        email: email.trim(),
        avatarUrl,
      });
      await refreshProfile();
      showToast('Profil mis à jour.', 'success');
    } catch (submitError) {
      const message = formatAdminError(submitError);
      setProfileError(message);
      showToast(message, 'error');
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordError(null);

    if (newPassword.length < 8) {
      setPasswordError('Le nouveau mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Les deux mots de passe ne correspondent pas.');
      return;
    }

    if (!accessToken) {
      setPasswordError('Votre session a expiré. Reconnectez-vous.');
      return;
    }

    setIsSavingPassword(true);

    try {
      await changePasswordRequest(accessToken, currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('Mot de passe mis à jour.', 'success');
    } catch (submitError) {
      const message = formatAdminError(submitError);
      setPasswordError(message);
      showToast(message, 'error');
    } finally {
      setIsSavingPassword(false);
    }
  }

  const displayName = name.trim() || profile?.name || 'Administrateur';

  return (
    <AdminAuthGate>
      <AdminShell>
        <AdminPageHeader
          label="Compte"
          title="Paramètres"
          lead="Gérez votre profil et la sécurité de votre compte administrateur."
        />

        <div className="admin-settings-layout">
          <aside className="admin-settings-aside" aria-labelledby="settings-profile">
            <section className="admin-settings-profile-card" id="settings-profile">
              <div className="admin-settings-profile-card__hero">
                {accessToken ? (
                  <ProfileAvatarField
                    name={displayName}
                    value={avatarUrl}
                    accessToken={accessToken}
                    onChange={setAvatarUrl}
                  />
                ) : null}
                <span className="admin-settings-profile-card__badge">
                  <ShieldCheck className="h-3 w-3" aria-hidden />
                  Administrateur
                </span>
              </div>

              <form
                className="admin-settings-profile-card__form"
                onSubmit={(e) => void handleProfileSubmit(e)}
              >
                {profileError ? (
                  <div role="alert" className="admin-alert admin-settings-profile-card__alert">
                    {profileError}
                  </div>
                ) : null}

                <div className="admin-settings-field">
                  <label htmlFor="profile-name" className="admin-settings-field__label">
                    <User className="h-3 w-3" aria-hidden />
                    Nom
                  </label>
                  <input
                    id="profile-name"
                    type="text"
                    autoComplete="name"
                    className="admin-settings-field__input admin-settings-field__input--plain"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                  />
                </div>

                <div className="admin-settings-field">
                  <label htmlFor="profile-email" className="admin-settings-field__label">
                    <Mail className="h-3 w-3" aria-hidden />
                    Email
                  </label>
                  <input
                    id="profile-email"
                    type="email"
                    autoComplete="email"
                    className="admin-settings-field__input admin-settings-field__input--plain"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>

                <div className="admin-settings-profile-card__readonly">
                  <span className="admin-settings-profile-card__readonly-label">
                    <Clock className="h-3 w-3" aria-hidden />
                    Dernière connexion
                  </span>
                  <span className="admin-settings-profile-card__readonly-value">
                    {profile?.lastLoginAt ? formatAdminDate(profile.lastLoginAt) : '—'}
                  </span>
                </div>

                <footer className="admin-settings-profile-card__foot">
                  <button
                    type="submit"
                    className="admin-btn admin-btn--primary admin-btn--sm"
                    disabled={isSavingProfile || !profileDirty}
                  >
                    {isSavingProfile ? 'Enregistrement…' : 'Enregistrer le profil'}
                  </button>
                </footer>
              </form>
            </section>

            <section className="admin-settings-tips" aria-labelledby="settings-tips-title">
              <h2 id="settings-tips-title" className="admin-settings-tips__title">
                <Shield className="h-3.5 w-3.5" aria-hidden />
                Bonnes pratiques
              </h2>
              <ul className="admin-settings-tips__list">
                {securityTips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </section>
          </aside>

          <section className="admin-settings-main" aria-labelledby="settings-security-title">
            <header className="admin-settings-main__head">
              <span className="admin-settings-main__icon" aria-hidden>
                <KeyRound className="h-4 w-4" />
              </span>
              <div>
                <h2 id="settings-security-title" className="admin-settings-main__title">
                  Sécurité du compte
                </h2>
                <p className="admin-settings-main__lead">
                  Modifiez votre mot de passe de connexion à l&apos;espace admin
                </p>
              </div>
            </header>

            <form className="admin-settings-main__form" onSubmit={(e) => void handlePasswordSubmit(e)}>
              {passwordError ? (
                <div role="alert" className="admin-alert">
                  {passwordError}
                </div>
              ) : null}

              <div className="admin-settings-main__fields">
                <div className="admin-settings-field admin-settings-field--full">
                  <label htmlFor="current-password" className="admin-settings-field__label">
                    Mot de passe actuel
                  </label>
                  <div className="admin-settings-field__wrap">
                    <Lock className="admin-settings-field__icon h-3.5 w-3.5" aria-hidden />
                    <input
                      id="current-password"
                      type="password"
                      autoComplete="current-password"
                      className="admin-settings-field__input"
                      value={currentPassword}
                      onChange={(event) => setCurrentPassword(event.target.value)}
                      placeholder="Saisissez votre mot de passe actuel"
                      required
                    />
                  </div>
                </div>

                <div className="admin-settings-field">
                  <label htmlFor="new-password" className="admin-settings-field__label">
                    Nouveau mot de passe
                  </label>
                  <div className="admin-settings-field__wrap">
                    <Lock className="admin-settings-field__icon h-3.5 w-3.5" aria-hidden />
                    <input
                      id="new-password"
                      type="password"
                      autoComplete="new-password"
                      className="admin-settings-field__input"
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                      placeholder="8 caractères minimum"
                      required
                      minLength={8}
                    />
                  </div>
                </div>

                <div className="admin-settings-field">
                  <label htmlFor="confirm-password" className="admin-settings-field__label">
                    Confirmer
                  </label>
                  <div className="admin-settings-field__wrap">
                    <Lock className="admin-settings-field__icon h-3.5 w-3.5" aria-hidden />
                    <input
                      id="confirm-password"
                      type="password"
                      autoComplete="new-password"
                      className="admin-settings-field__input"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      placeholder="Répétez le nouveau mot de passe"
                      required
                    />
                  </div>
                </div>
              </div>

              <footer className="admin-settings-main__foot">
                <p className="admin-settings-main__hint">
                  Le changement prend effet immédiatement. Vous resterez connecté sur cet appareil.
                </p>
                <button
                  type="submit"
                  className="admin-btn admin-btn--primary admin-btn--sm"
                  disabled={isSavingPassword}
                >
                  {isSavingPassword ? 'Enregistrement…' : 'Enregistrer le mot de passe'}
                </button>
              </footer>
            </form>
          </section>
        </div>
      </AdminShell>
    </AdminAuthGate>
  );
}
