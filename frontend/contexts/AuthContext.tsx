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
import { loginRequest, logoutRequest, refreshRequest } from '@/lib/auth-api';
import { formatAdminError } from '@/lib/admin-utils';

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
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const tokenRef = useRef<string | null>(null);

  const syncToken = useCallback((token: string | null) => {
    tokenRef.current = token;
    setAccessToken(token);
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
        }
      } catch {
        if (!cancelled) {
          syncToken(null);
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
  }, [syncToken]);

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
    },
    [syncToken],
  );

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      syncToken(null);
      setAdminSessionHint(false);
      router.replace('/admin/login');
    }
  }, [router, syncToken]);

  const value = useMemo<AuthContextValue>(
    () => ({
      accessToken,
      isAuthenticated: Boolean(accessToken),
      isLoading,
      login,
      logout,
    }),
    [accessToken, isLoading, login, logout],
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
