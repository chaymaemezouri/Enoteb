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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const crypto_1 = require("crypto");
const bcrypt = require("bcrypt");
const prisma_service_1 = require("../../prisma/prisma.service");
const constants_1 = require("./constants");
let AuthService = AuthService_1 = class AuthService {
    constructor(prisma, jwtService, config) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.config = config;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async login(email, password) {
        const admin = await this.prisma.adminUser.findUnique({
            where: { email: email.toLowerCase() },
        });
        const passwordValid = admin && (await bcrypt.compare(password, admin.passwordHash));
        if (!admin || !passwordValid) {
            this.logger.warn(`Tentative de connexion échouée pour l'email: ${email.toLowerCase()}`);
            throw new common_1.UnauthorizedException(constants_1.INVALID_CREDENTIALS_MESSAGE);
        }
        await this.prisma.adminUser.update({
            where: { id: admin.id },
            data: { lastLoginAt: new Date() },
        });
        return this.issueTokens(admin.id, admin.email);
    }
    async refresh(refreshToken) {
        const storedToken = await this.findValidRefreshToken(refreshToken);
        if (!storedToken) {
            throw new common_1.UnauthorizedException(constants_1.INVALID_CREDENTIALS_MESSAGE);
        }
        await this.revokeRefreshToken(storedToken.id);
        return this.issueTokens(storedToken.admin.id, storedToken.admin.email);
    }
    async getProfile(adminId) {
        const admin = await this.prisma.adminUser.findUnique({
            where: { id: adminId },
            select: { id: true, email: true, name: true, avatarUrl: true, lastLoginAt: true },
        });
        if (!admin) {
            throw new common_1.UnauthorizedException(constants_1.INVALID_CREDENTIALS_MESSAGE);
        }
        return admin;
    }
    async updateProfile(adminId, name, email, avatarUrl) {
        const normalizedEmail = email.trim().toLowerCase();
        const trimmedName = name.trim();
        if (!trimmedName) {
            throw new common_1.BadRequestException('Le nom est obligatoire.');
        }
        const existing = await this.prisma.adminUser.findUnique({
            where: { id: adminId },
        });
        if (!existing) {
            throw new common_1.UnauthorizedException(constants_1.INVALID_CREDENTIALS_MESSAGE);
        }
        if (normalizedEmail !== existing.email) {
            const emailTaken = await this.prisma.adminUser.findUnique({
                where: { email: normalizedEmail },
            });
            if (emailTaken) {
                throw new common_1.ConflictException('Cette adresse email est déjà utilisée.');
            }
        }
        return this.prisma.adminUser.update({
            where: { id: adminId },
            data: {
                name: trimmedName,
                email: normalizedEmail,
                ...(avatarUrl !== undefined
                    ? { avatarUrl: avatarUrl.trim() || null }
                    : {}),
            },
            select: { id: true, email: true, name: true, avatarUrl: true, lastLoginAt: true },
        });
    }
    async changePassword(adminId, currentPassword, newPassword) {
        const admin = await this.prisma.adminUser.findUnique({
            where: { id: adminId },
        });
        if (!admin) {
            throw new common_1.UnauthorizedException(constants_1.INVALID_CREDENTIALS_MESSAGE);
        }
        const passwordValid = await bcrypt.compare(currentPassword, admin.passwordHash);
        if (!passwordValid) {
            throw new common_1.BadRequestException('Le mot de passe actuel est incorrect.');
        }
        const passwordHash = await bcrypt.hash(newPassword, 12);
        await this.prisma.adminUser.update({
            where: { id: adminId },
            data: { passwordHash },
        });
    }
    async logout(refreshToken) {
        if (!refreshToken) {
            return;
        }
        const storedToken = await this.findValidRefreshToken(refreshToken);
        if (storedToken) {
            await this.revokeRefreshToken(storedToken.id);
        }
    }
    async issueTokens(adminId, email) {
        const payload = { sub: adminId, email };
        const accessToken = await this.jwtService.signAsync(payload);
        const refreshToken = (0, crypto_1.randomBytes)(64).toString('base64url');
        const tokenHash = this.hashRefreshToken(refreshToken);
        const refreshExpiresIn = this.config.get('jwt.refreshExpiresIn');
        const expiresAt = this.computeExpiryDate(refreshExpiresIn);
        await this.prisma.refreshToken.create({
            data: {
                adminId,
                tokenHash,
                expiresAt,
            },
        });
        return { accessToken, refreshToken };
    }
    async findValidRefreshToken(refreshToken) {
        const tokenHash = this.hashRefreshToken(refreshToken);
        return this.prisma.refreshToken.findFirst({
            where: {
                tokenHash,
                revokedAt: null,
                expiresAt: { gt: new Date() },
            },
            include: { admin: true },
        });
    }
    async revokeRefreshToken(tokenId) {
        await this.prisma.refreshToken.update({
            where: { id: tokenId },
            data: { revokedAt: new Date() },
        });
    }
    hashRefreshToken(token) {
        return (0, crypto_1.createHash)('sha256').update(token).digest('hex');
    }
    computeExpiryDate(duration) {
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
        return new Date(Date.now() + value * multipliers[unit]);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map