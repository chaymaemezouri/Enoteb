import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly config;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService, config: ConfigService);
    login(email: string, password: string): Promise<AuthTokens>;
    refresh(refreshToken: string): Promise<AuthTokens>;
    getProfile(adminId: string): Promise<{
        id: string;
        email: string;
        name: string;
        avatarUrl: string | null;
        lastLoginAt: Date | null;
    }>;
    updateProfile(adminId: string, name: string, email: string, avatarUrl?: string): Promise<{
        id: string;
        email: string;
        name: string;
        avatarUrl: string | null;
        lastLoginAt: Date | null;
    }>;
    changePassword(adminId: string, currentPassword: string, newPassword: string): Promise<void>;
    logout(refreshToken?: string): Promise<void>;
    private issueTokens;
    private findValidRefreshToken;
    private revokeRefreshToken;
    private hashRefreshToken;
    private computeExpiryDate;
}
