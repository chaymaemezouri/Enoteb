import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class HttpsRedirectMiddleware implements NestMiddleware {
  constructor(private readonly config: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    if (this.config.get<string>('nodeEnv') !== 'production') {
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
}
