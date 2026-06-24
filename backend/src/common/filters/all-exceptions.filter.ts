import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly config: ConfigService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const isProduction = this.config.get<string>('nodeEnv') === 'production';

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Une erreur interne est survenue';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const payload = exceptionResponse as Record<string, unknown>;

        if (typeof payload.message === 'string') {
          message = payload.message;
        } else if (Array.isArray(payload.message)) {
          message = payload.message.map(String);
        } else if (typeof payload.message === 'undefined' && payload.success === false) {
          response.status(status).json(payload);
          return;
        }
      }
    }

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `${request.method} ${request.url} → ${status}`,
        isProduction ? undefined : String(exception),
      );
    }

    const body: Record<string, unknown> = {
      statusCode: status,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    if (!isProduction && exception instanceof Error) {
      body.stack = exception.stack;

      if (exception instanceof HttpException) {
        body.details = exception.getResponse();
      }
    }

    response.status(status).json(body);
  }
}
