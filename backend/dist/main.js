"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const cookieParser = require("cookie-parser");
const app_module_1 = require("./app.module");
const all_exceptions_filter_1 = require("./common/filters/all-exceptions.filter");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
const security_config_1 = require("./config/security.config");
const prisma_service_1 = require("./prisma/prisma.service");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = app.get(config_1.ConfigService);
    const prisma = app.get(prisma_service_1.PrismaService);
    app.use(cookieParser());
    (0, security_config_1.configureSecurity)(app);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter(config));
    app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor());
    await prisma.enableShutdownHooks(app);
    const port = Number(process.env.PORT) || config.get('port') || 3000;
    await app.listen(port);
}
bootstrap();
//# sourceMappingURL=main.js.map