"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureSecurity = configureSecurity;
const config_1 = require("@nestjs/config");
const helmet_1 = require("helmet");
const PRODUCTION_ORIGINS = [
    'https://enoteb.ma',
    'https://www.enoteb.ma',
];
function configureSecurity(app) {
    const config = app.get(config_1.ConfigService);
    const nodeEnv = config.get('nodeEnv');
    const isProduction = nodeEnv === 'production';
    const httpAdapter = app.getHttpAdapter().getInstance();
    httpAdapter.disable('x-powered-by');
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                baseUri: ["'self'"],
                fontSrc: ["'self'", 'https:', 'data:'],
                formAction: ["'self'"],
                frameAncestors: ["'self'"],
                imgSrc: [
                    "'self'",
                    'data:',
                    'blob:',
                    'https://enoteb.ma',
                    'https://www.enoteb.ma',
                    'https://maps.googleapis.com',
                    'https://maps.gstatic.com',
                    ...(isProduction ? [] : ['https://picsum.photos']),
                ],
                objectSrc: ["'none'"],
                scriptSrc: [
                    "'self'",
                    'https://maps.googleapis.com',
                    'https://maps.gstatic.com',
                ],
                styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
                connectSrc: [
                    "'self'",
                    'https://enoteb.ma',
                    'https://www.enoteb.ma',
                    'https://maps.googleapis.com',
                ],
                upgradeInsecureRequests: isProduction ? [] : null,
            },
        },
        crossOriginResourcePolicy: { policy: 'cross-origin' },
    }));
    const allowedOrigins = isProduction
        ? [...PRODUCTION_ORIGINS]
        : [
            ...PRODUCTION_ORIGINS,
            config.get('corsOrigin'),
            'http://localhost:3000',
            'http://localhost:3001',
        ].filter((origin, index, array) => {
            return Boolean(origin) && array.indexOf(origin) === index;
        });
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin) {
                callback(null, true);
                return;
            }
            if (!isProduction) {
                try {
                    const { hostname } = new URL(origin);
                    if (hostname === 'localhost' || hostname === '127.0.0.1') {
                        callback(null, true);
                        return;
                    }
                }
                catch {
                }
            }
            callback(null, allowedOrigins.includes(origin));
        },
        credentials: true,
    });
}
//# sourceMappingURL=security.config.js.map