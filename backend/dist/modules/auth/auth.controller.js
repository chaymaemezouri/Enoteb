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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const auth_service_1 = require("./auth.service");
const constants_1 = require("./constants");
const login_dto_1 = require("./dto/login.dto");
const change_password_dto_1 = require("./dto/change-password.dto");
const update_profile_dto_1 = require("./dto/update-profile.dto");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const current_admin_decorator_1 = require("./decorators/current-admin.decorator");
let AuthController = class AuthController {
    constructor(authService, config) {
        this.authService = authService;
        this.config = config;
    }
    async login(body, res) {
        const tokens = await this.authService.login(body.email, body.password);
        this.setRefreshTokenCookie(res, tokens.refreshToken);
        return { accessToken: tokens.accessToken };
    }
    async refresh(req, res) {
        const refreshToken = req.cookies?.[constants_1.REFRESH_TOKEN_COOKIE];
        if (!refreshToken) {
            throw new common_1.UnauthorizedException(constants_1.INVALID_CREDENTIALS_MESSAGE);
        }
        const tokens = await this.authService.refresh(refreshToken);
        this.setRefreshTokenCookie(res, tokens.refreshToken);
        return { accessToken: tokens.accessToken };
    }
    async logout(req, res) {
        const refreshToken = req.cookies?.[constants_1.REFRESH_TOKEN_COOKIE];
        await this.authService.logout(refreshToken);
        this.clearRefreshTokenCookie(res);
    }
    async me(admin) {
        return this.authService.getProfile(admin.id);
    }
    async updateProfile(admin, body) {
        return this.authService.updateProfile(admin.id, body.name, body.email, body.avatarUrl);
    }
    async changePassword(admin, body) {
        await this.authService.changePassword(admin.id, body.currentPassword, body.newPassword);
    }
    setRefreshTokenCookie(res, refreshToken) {
        const refreshExpiresIn = this.config.get('jwt.refreshExpiresIn');
        const maxAgeMs = this.parseDurationToMs(refreshExpiresIn);
        const isProduction = this.config.get('nodeEnv') === 'production';
        res.cookie(constants_1.REFRESH_TOKEN_COOKIE, refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'strict',
            maxAge: maxAgeMs,
            path: '/auth',
        });
    }
    clearRefreshTokenCookie(res) {
        const isProduction = this.config.get('nodeEnv') === 'production';
        res.clearCookie(constants_1.REFRESH_TOKEN_COOKIE, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'strict',
            path: '/auth',
        });
    }
    parseDurationToMs(duration) {
        const match = duration.match(/^(\d+)([smhd])$/);
        if (!match) {
            throw new Error(`Durée JWT invalide: ${duration}`);
        }
        const value = Number(match[1]);
        const unit = match[2];
        const multipliers = {
            s: 1000,
            m: 60 * 1000,
            h: 60 * 60 * 1000,
            d: 24 * 60 * 60 * 1000,
        };
        return value * multipliers[unit];
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(200),
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    (0, throttler_1.Throttle)({
        login: { limit: constants_1.LOGIN_THROTTLE.limit, ttl: constants_1.LOGIN_THROTTLE.ttl },
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.HttpCode)(204),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, current_admin_decorator_1.CurrentAdmin)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "me", null);
__decorate([
    (0, common_1.Patch)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, current_admin_decorator_1.CurrentAdmin)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_profile_dto_1.UpdateProfileDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Patch)('password'),
    (0, common_1.HttpCode)(204),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, current_admin_decorator_1.CurrentAdmin)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, change_password_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changePassword", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        config_1.ConfigService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map