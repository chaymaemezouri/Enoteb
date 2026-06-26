"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpsRedirectMiddleware = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let HttpsRedirectMiddleware = class HttpsRedirectMiddleware {
    constructor(config) {
        this.config = config;
    }
    use(req, res, next) {
        if (this.config.get('nodeEnv') !== 'production') {
            next();
            return;
        }
        const forwardedProto = req.headers['x-forwarded-proto'];
        if (forwardedProto === 'http') {
            const host = req.headers.host;
            if (host) {
                res.redirect(301, `https://${host}${req.originalUrl}`);
                return;
            }
        }
        next();
    }
};
exports.HttpsRedirectMiddleware = HttpsRedirectMiddleware;
exports.HttpsRedirectMiddleware = HttpsRedirectMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], HttpsRedirectMiddleware);
//# sourceMappingURL=https-redirect.middleware.js.map