import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import {
  INVALID_CREDENTIALS_MESSAGE,
  LOGIN_THROTTLE,
  REFRESH_TOKEN_COOKIE,
} from './constants';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Post('login')
  @HttpCode(200)
  @UseGuards(ThrottlerGuard)
  @Throttle({
    login: { limit: LOGIN_THROTTLE.limit, ttl: LOGIN_THROTTLE.ttl },
  })
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.login(body.email, body.password);

    this.setRefreshTokenCookie(res, tokens.refreshToken);

    return { accessToken: tokens.accessToken };
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE] as
      | string
      | undefined;

    if (!refreshToken) {
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }

    const tokens = await this.authService.refresh(refreshToken);

    this.setRefreshTokenCookie(res, tokens.refreshToken);

    return { accessToken: tokens.accessToken };
  }

  @Post('logout')
  @HttpCode(204)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE] as
      | string
      | undefined;

    await this.authService.logout(refreshToken);
    this.clearRefreshTokenCookie(res);
  }

  private setRefreshTokenCookie(res: Response, refreshToken: string): void {
    const refreshExpiresIn = this.config.get<string>('jwt.refreshExpiresIn')!;
    const maxAgeMs = this.parseDurationToMs(refreshExpiresIn);
    const isProduction = this.config.get<string>('nodeEnv') === 'production';

    res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: maxAgeMs,
      path: '/auth',
    });
  }

  private clearRefreshTokenCookie(res: Response): void {
    const isProduction = this.config.get<string>('nodeEnv') === 'production';

    res.clearCookie(REFRESH_TOKEN_COOKIE, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      path: '/auth',
    });
  }

  private parseDurationToMs(duration: string): number {
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

    return value * multipliers[unit];
  }
}
