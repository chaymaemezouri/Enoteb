import { NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';
export declare class HttpsRedirectMiddleware implements NestMiddleware {
    private readonly config;
    constructor(config: ConfigService);
    use(req: Request, res: Response, next: NextFunction): void;
}
