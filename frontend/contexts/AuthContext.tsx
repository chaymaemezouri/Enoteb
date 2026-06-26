'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { setAccessTokenGetter } from '@/lib/admin-api';
import { loginRequest, logoutRequest, meRequest, refreshRequest } from '@/lib/auth-api';
import { formatAdminError } from '@/lib/admin-utils';
import type { AdminProfile } from '@/types/admin';

const ADMIN_SESSION_COOKIE = 'enoteb_admin_session';

function setAdminSessionHint(active: boolean): void {
  if (typeof document === 'undefined') {
    return;
  }

  if (active) {
    document.cookie = `${ADMIN_SESSION_COOKIE}=1; path=/; max-age=604800; SameSite=Lax`;
    return;
  }

  document.cookie = `${ADMIN_SESSION_COOKIE}=; path=/; max-age=0`;
}

interface AuthContextValue {
  accessToken: string | null;
  profile: AdminProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const tokenRef = useRef<string | null>(null);

  const syncToken = useCallback((token: string | null) => {
    tokenRef.current = token;
    setAccessToken(token);
  }, []);

  const loadProfile = useCallback(async (token: string) => {
    try {
      const adminProfile = await meRequest(token);
      setProfile(adminProfile);
    } catch {
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    setAccessTokenGetter(() => tokenRef.current);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        const response = await refreshRequest();
        if (!cancelled) {
          syncToken(response.accessToken);
          setAdminSessionHint(true);
          await loadProfile(response.accessToken);
        }
      } catch {
        if (!cancelled) {
          syncToken(null);
          setProfile(null);
          setAdminSessionHint(false);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, [syncToken, loadProfile]);

  useEffect(() => {
    if (!isLoading && !accessToken) {
      setAdminSessionHint(false);
    }
  }, [accessToken, isLoading]);

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await loginRequest(email, password);
      syncToken(response.accessToken);
      setAdminSessionHint(true);
      await loadProfile(response.accessToken);
    },
    [syncToken, loadProfile],
  );

  const refreshProfile = useCallback(async () => {
    if (!tokenRef.current) {
      return;
    }

    await loadProfile(tokenRef.current);
  }, [loadProfile]);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      syncToken(null);
      setProfile(null);
      setAdminSessionHint(false);
      router.replace('/admin/login');
    }
  }, [router, syncToken]);

  const value = useMemo<AuthContextValue>(
    () => ({
      accessToken,
      profile,
      isAuthenticated: Boolean(accessToken),
      isLoading,
      login,
      logout,
      refreshProfile,
    }),
    [accessToken, profile, isLoading, login, logout, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth doit être utilisé dans AuthProvider.');
  }

  return context;
}

export function useAuthLoginError() {
  return formatAdminError;
}
