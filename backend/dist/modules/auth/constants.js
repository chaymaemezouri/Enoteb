"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOGIN_THROTTLE = exports.INVALID_CREDENTIALS_MESSAGE = exports.REFRESH_TOKEN_COOKIE = void 0;
exports.REFRESH_TOKEN_COOKIE = 'refresh_token';
exports.INVALID_CREDENTIALS_MESSAGE = 'Identifiants invalides';
exports.LOGIN_THROTTLE = {
    name: 'login',
    ttl: 15 * 60 * 1000,
    limit: 5,
};
//# sourceMappingURL=constants.js.map