import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const startedAt = Date.now();
    const request = context.switchToHttp().getRequest<Request>();

    return next.handle().pipe(
      tap({
        next: () => this.logRequest(request, startedAt),
        error: () => this.logRequest(request, startedAt),
      }),
    );
  }

  private logRequest(request: Request, startedAt: number): void {
    const response = request.res as Response | undefined;
    const duration = Date.now() - startedAt;
    const status = response?.statusCode ?? 500;

    this.logger.log(
      `${request.method} ${request.originalUrl} ${status} ${duration}ms`,
    );
  }
}
