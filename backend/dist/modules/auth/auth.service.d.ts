import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../../common/mail/mail.service';
import { PrismaService } from '../../prisma/prisma.service';
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly config;
    private readonly mailService;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService, config: ConfigService, mailService: MailService);
    login(email: string, password: string): Promise<AuthTokens>;
    refresh(refreshToken: string): Promise<AuthTokens>;
    getProfile(adminId: string): Promise<{
        name: string;
        id: string;
        email: string;
        avatarUrl: string | null;
        lastLoginAt: Date | null;
    }>;
    updateProfile(adminId: string, name: string, email: string, avatarUrl?: string): Promise<{
        name: string;
        id: string;
        email: string;
        avatarUrl: string | null;
        lastLoginAt: Date | null;
    }>;
    changePassword(adminId: string, currentPassword: string, newPassword: string): Promise<void>;
    private buildPasswordChangedAlertHtml;
    logout(refreshToken?: string): Promise<void>;
    private issueTokens;
    private findValidRefreshToken;
    private revokeRefreshToken;
    private hashRefreshToken;
    private computeExpiryDate;
}
