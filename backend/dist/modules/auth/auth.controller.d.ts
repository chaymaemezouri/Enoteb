import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthenticatedAdmin } from './interfaces/jwt-payload.interface';
export declare class AuthController {
    private readonly authService;
    private readonly config;
    constructor(authService: AuthService, config: ConfigService);
    login(body: LoginDto, res: Response): Promise<{
        accessToken: string;
    }>;
    refresh(req: Request, res: Response): Promise<{
        accessToken: string;
    }>;
    logout(req: Request, res: Response): Promise<void>;
    me(admin: AuthenticatedAdmin): Promise<{
        name: string;
        id: string;
        email: string;
        avatarUrl: string | null;
        lastLoginAt: Date | null;
    }>;
    updateProfile(admin: AuthenticatedAdmin, body: UpdateProfileDto): Promise<{
        name: string;
        id: string;
        email: string;
        avatarUrl: string | null;
        lastLoginAt: Date | null;
    }>;
    changePassword(admin: AuthenticatedAdmin, body: ChangePasswordDto): Promise<void>;
    private setRefreshTokenCookie;
    private clearRefreshTokenCookie;
    private parseDurationToMs;
}
