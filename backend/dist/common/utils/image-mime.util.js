"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectImageMimeFromBuffer = detectImageMimeFromBuffer;
exports.isAllowedImageMime = isAllowedImageMime;
const constants_1 = require("../constants");
function detectImageMimeFromBuffer(buffer) {
    if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
        return 'image/jpeg';
    }
    if (buffer.length >= 8 &&
        buffer[0] === 0x89 &&
        buffer[1] === 0x50 &&
        buffer[2] === 0x4e &&
        buffer[3] === 0x47) {
        return 'image/png';
    }
    if (buffer.length >= 12 &&
        buffer.toString('ascii', 0, 4) === 'RIFF' &&
        buffer.toString('ascii', 8, 12) === 'WEBP') {
        return 'image/webp';
    }
    return null;
}
function isAllowedImageMime(mime) {
    return constants_1.ALLOWED_IMAGE_MIMES.includes(mime);
}
//# sourceMappingURL=image-mime.util.js.map