"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const configuration_1 = require("./config/configuration");
const env_validation_1 = require("./config/env.validation");
const file_storage_module_1 = require("./common/storage/file-storage.module");
const https_redirect_middleware_1 = require("./common/middleware/https-redirect.middleware");
const health_module_1 = require("./health/health.module");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./modules/auth/auth.module");
const constants_1 = require("./modules/auth/constants");
const contact_module_1 = require("./modules/contact/contact.module");
const constants_2 = require("./modules/contact/constants");
const projects_module_1 = require("./modules/projects/projects.module");
const sectors_module_1 = require("./modules/sectors/sectors.module");
const upload_module_1 = require("./modules/upload/upload.module");
const admin_module_1 = require("./modules/admin/admin.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(https_redirect_middleware_1.HttpsRedirectMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.default],
                validationSchema: env_validation_1.envValidationSchema,
            }),
            throttler_1.ThrottlerModule.forRoot({
                throttlers: [
                    {
                        name: constants_1.LOGIN_THROTTLE.name,
                        ttl: constants_1.LOGIN_THROTTLE.ttl,
                        limit: constants_1.LOGIN_THROTTLE.limit,
                    },
                    {
                        name: constants_2.CONTACT_THROTTLE.name,
                        ttl: constants_2.CONTACT_THROTTLE.ttl,
                        limit: constants_2.CONTACT_THROTTLE.limit,
                    },
                ],
            }),
            file_storage_module_1.FileStorageModule,
            prisma_module_1.PrismaModule,
            health_module_1.HealthModule,
            auth_module_1.AuthModule,
            sectors_module_1.SectorsModule,
            projects_module_1.ProjectsModule,
            upload_module_1.UploadModule,
            contact_module_1.ContactModule,
            admin_module_1.AdminModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map