import { AllowedImageMime } from '../constants';
export declare function detectImageMimeFromBuffer(buffer: Buffer): AllowedImageMime | null;
export declare function isAllowedImageMime(mime: string): mime is AllowedImageMime;
