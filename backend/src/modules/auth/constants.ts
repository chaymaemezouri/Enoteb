export const REFRESH_TOKEN_COOKIE = 'refresh_token';

export const INVALID_CREDENTIALS_MESSAGE = 'Identifiants invalides';

export const LOGIN_THROTTLE = {
  name: 'login',
  ttl: 15 * 60 * 1000,
  limit: 5,
} as const;
