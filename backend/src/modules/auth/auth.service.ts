import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { INVALID_CREDENTIALS_MESSAGE } from './constants';
import { JwtPayload } from './interfaces/jwt-payload.interface';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(email: string, password: string): Promise<AuthTokens> {
    const admin = await this.prisma.adminUser.findUnique({
      where: { email: email.toLowerCase() },
    });

    const passwordValid =
      admin && (await bcrypt.compare(password, admin.passwordHash));

    if (!admin || !passwordValid) {
      this.logger.warn(
        `Tentative de connexion échouée pour l'email: ${email.toLowerCase()}`,
      );
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }

    await this.prisma.adminUser.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() },
    });

    return this.issueTokens(admin.id, admin.email);
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    const storedToken = await this.findValidRefreshToken(refreshToken);

    if (!storedToken) {
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }

    await this.revokeRefreshToken(storedToken.id);

    return this.issueTokens(storedToken.admin.id, storedToken.admin.email);
  }

  async getProfile(adminId: string) {
    const admin = await this.prisma.adminUser.findUnique({
      where: { id: adminId },
      select: { id: true, email: true, name: true, avatarUrl: true, lastLoginAt: true },
    });

    if (!admin) {
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }

    return admin;
  }

  async updateProfile(
    adminId: string,
    name: string,
    email: string,
    avatarUrl?: string,
  ) {
    const normalizedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    if (!trimmedName) {
      throw new BadRequestException('Le nom est obligatoire.');
    }

    const existing = await this.prisma.adminUser.findUnique({
      where: { id: adminId },
    });

    if (!existing) {
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }

    if (normalizedEmail !== existing.email) {
      const emailTaken = await this.prisma.adminUser.findUnique({
        where: { email: normalizedEmail },
      });

      if (emailTaken) {
        throw new ConflictException('Cette adresse email est déjà utilisée.');
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

  async changePassword(
    adminId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const admin = await this.prisma.adminUser.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }

    const passwordValid = await bcrypt.compare(currentPassword, admin.passwordHash);

    if (!passwordValid) {
      throw new BadRequestException('Le mot de passe actuel est incorrect.');
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await this.prisma.adminUser.update({
      where: { id: adminId },
      data: { passwordHash },
    });
  }

  async logout(refreshToken?: string): Promise<void> {
    if (!refreshToken) {
      return;
    }

    const storedToken = await this.findValidRefreshToken(refreshToken);

    if (storedToken) {
      await this.revokeRefreshToken(storedToken.id);
    }
  }

  private async issueTokens(
    adminId: string,
    email: string,
  ): Promise<AuthTokens> {
    const payload: JwtPayload = { sub: adminId, email };

    const accessToken = await this.jwtService.signAsync(payload);

    const refreshToken = randomBytes(64).toString('base64url');
    const tokenHash = this.hashRefreshToken(refreshToken);
    const refreshExpiresIn = this.config.get<string>('jwt.refreshExpiresIn')!;
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

  private async findValidRefreshToken(refreshToken: string) {
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

  private async revokeRefreshToken(tokenId: string): Promise<void> {
    await this.prisma.refreshToken.update({
      where: { id: tokenId },
      data: { revokedAt: new Date() },
    });
  }

  private hashRefreshToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private computeExpiryDate(duration: string): Date {
    const match = duration.match(/^(\d+)([smhd])$/);

    if (!match) {
      throw new Error(`Durée JWT invalide: ${duration}`);
    }

    const value = Number(match[1]);
    const unit = match[2];

    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };

    return new Date(Date.now() + value * multipliers[unit]);
  }
}
