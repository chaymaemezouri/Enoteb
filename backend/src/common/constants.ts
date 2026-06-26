export const KEBAB_SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const KEBAB_SLUG_MESSAGE =
  'Le slug doit être en kebab-case (lettres minuscules, chiffres et tirets)';

export const PROJECT_YEAR_MIN = 1990;
export const PROJECT_YEAR_MAX = 2030;

export const UPLOAD_PUBLIC_PREFIX = '/uploads';
export const MAX_IMAGE_SIZE_BYTES = Number(
  process.env.MAX_FILE_SIZE ?? 20 * 1024 * 1024,
);
export const THUMBNAIL_FILENAME_SUFFIX = '-thumb';

export const ALLOWED_IMAGE_MIMES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export type AllowedImageMime = (typeof ALLOWED_IMAGE_MIMES)[number];

export const IMAGE_MIME_EXTENSIONS: Record<AllowedImageMime, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};
