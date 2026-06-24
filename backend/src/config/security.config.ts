import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';

const PRODUCTION_ORIGINS = [
  'https://enoteb.ma',
  'https://www.enoteb.ma',
] as const;

export function configureSecurity(app: INestApplication): void {
  const config = app.get(ConfigService);
  const nodeEnv = config.get<string>('nodeEnv');
  const isProduction = nodeEnv === 'production';

  const httpAdapter = app.getHttpAdapter().getInstance();
  httpAdapter.disable('x-powered-by');

  app.use(
    helmet({
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
    }),
  );

  const allowedOrigins = isProduction
    ? [...PRODUCTION_ORIGINS]
    : [
        ...PRODUCTION_ORIGINS,
        config.get<string>('corsOrigin'),
        'http://localhost:3000',
        'http://localhost:3001',
      ].filter((origin, index, array): origin is string => {
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
        } catch {
          // ignore invalid origin URLs
        }
      }

      callback(null, allowedOrigins.includes(origin));
    },
    credentials: true,
  });
}
