"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IMAGE_MIME_EXTENSIONS = exports.ALLOWED_IMAGE_MIMES = exports.THUMBNAIL_FILENAME_SUFFIX = exports.MAX_IMAGE_SIZE_BYTES = exports.UPLOAD_PUBLIC_PREFIX = exports.PROJECT_YEAR_MAX = exports.PROJECT_YEAR_MIN = exports.KEBAB_SLUG_MESSAGE = exports.KEBAB_SLUG_REGEX = void 0;
exports.KEBAB_SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
exports.KEBAB_SLUG_MESSAGE = 'Le slug doit être en kebab-case (lettres minuscules, chiffres et tirets)';
exports.PROJECT_YEAR_MIN = 1990;
exports.PROJECT_YEAR_MAX = 2030;
exports.UPLOAD_PUBLIC_PREFIX = '/uploads';
exports.MAX_IMAGE_SIZE_BYTES = Number(process.env.MAX_FILE_SIZE ?? 20 * 1024 * 1024);
exports.THUMBNAIL_FILENAME_SUFFIX = '-thumb';
exports.ALLOWED_IMAGE_MIMES = [
    'image/jpeg',
    'image/png',
    'image/webp',
];
exports.IMAGE_MIME_EXTENSIONS = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
};
//# sourceMappingURL=constants.js.map