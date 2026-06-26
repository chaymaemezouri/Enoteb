"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AllExceptionsFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let AllExceptionsFilter = AllExceptionsFilter_1 = class AllExceptionsFilter {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(AllExceptionsFilter_1.name);
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const isProduction = this.config.get('nodeEnv') === 'production';
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Une erreur interne est survenue';
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            if (typeof exceptionResponse === 'string') {
                message = exceptionResponse;
            }
            else if (typeof exceptionResponse === 'object' &&
                exceptionResponse !== null) {
                const payload = exceptionResponse;
                if (typeof payload.message === 'string') {
                    message = payload.message;
                }
                else if (Array.isArray(payload.message)) {
                    message = payload.message.map(String);
                }
                else if (typeof payload.message === 'undefined' && payload.success === false) {
                    response.status(status).json(payload);
                    return;
                }
            }
        }
        if (status >= common_1.HttpStatus.INTERNAL_SERVER_ERROR) {
            this.logger.error(`${request.method} ${request.url} → ${status}`, isProduction ? undefined : String(exception));
        }
        const body = {
            statusCode: status,
            message,
            path: request.url,
            timestamp: new Date().toISOString(),
        };
        if (!isProduction && exception instanceof Error) {
            body.stack = exception.stack;
            if (exception instanceof common_1.HttpException) {
                body.details = exception.getResponse();
            }
        }
        response.status(status).json(body);
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = AllExceptionsFilter_1 = __decorate([
    (0, common_1.Catch)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AllExceptionsFilter);
//# sourceMappingURL=all-exceptions.filter.js.map