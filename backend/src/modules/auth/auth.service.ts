import {
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
