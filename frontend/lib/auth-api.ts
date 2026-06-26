import { ApiClientError, getApiUrl } from './api';
import type { AuthLoginResponse } from '@/types/admin';

async function parseAuthError(response: Response): Promise<never> {
  let message = 'Une erreur est survenue.';

  try {
    const body = (await response.json()) as { message?: string | string[] };
    if (Array.isArray(body.message)) {
      message = body.message.join(', ');
    } else if (body.message) {
      message = body.message;
    }
  } catch {
    message = response.statusText;
  }

  throw new ApiClientError(response.status, [message]);
}

export async function loginRequest(email: string, password: string): Promise<AuthLoginResponse> {
  const response = await fetch(`${getApiUrl()}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    await parseAuthError(response);
  }

  return response.json() as Promise<AuthLoginResponse>;
}

export async function refreshRequest(): Promise<AuthLoginResponse> {
  const response = await fetch(`${getApiUrl()}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    await parseAuthError(response);
  }

  return response.json() as Promise<AuthLoginResponse>;
}

export async function logoutRequest(): Promise<void> {
  await fetch(`${getApiUrl()}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
}

export async function meRequest(accessToken: string): Promise<import('@/types/admin').AdminProfile> {
  const response = await fetch(`${getApiUrl()}/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: 'include',
  });

  if (!response.ok) {
    await parseAuthError(response);
  }

  return response.json() as Promise<import('@/types/admin').AdminProfile>;
}

export async function changePasswordRequest(
  accessToken: string,
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  const response = await fetch(`${getApiUrl()}/auth/password`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: 'include',
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  if (!response.ok) {
    await parseAuthError(response);
  }
}

export async function updateProfileRequest(
  accessToken: string,
  payload: { name: string; email: string; avatarUrl?: string },
): Promise<import('@/types/admin').AdminProfile> {
  const response = await fetch(`${getApiUrl()}/auth/me`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    await parseAuthError(response);
  }

  return response.json() as Promise<import('@/types/admin').AdminProfile>;
}
