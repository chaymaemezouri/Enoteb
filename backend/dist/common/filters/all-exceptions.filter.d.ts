import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class AllExceptionsFilter implements ExceptionFilter {
    private readonly config;
    private readonly logger;
    constructor(config: ConfigService);
    catch(exception: unknown, host: ArgumentsHost): void;
}
