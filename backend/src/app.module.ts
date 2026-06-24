import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';

import { ThrottlerModule } from '@nestjs/throttler';

import configuration from './config/configuration';

import { envValidationSchema } from './config/env.validation';

import { FileStorageModule } from './common/storage/file-storage.module';

import { HttpsRedirectMiddleware } from './common/middleware/https-redirect.middleware';

import { HealthModule } from './health/health.module';

import { PrismaModule } from './prisma/prisma.module';

import { AuthModule } from './modules/auth/auth.module';

import { LOGIN_THROTTLE } from './modules/auth/constants';

import { ContactModule } from './modules/contact/contact.module';

import { CONTACT_THROTTLE } from './modules/contact/constants';

import { ProjectsModule } from './modules/projects/projects.module';

import { SectorsModule } from './modules/sectors/sectors.module';

import { UploadModule } from './modules/upload/upload.module';
import { AdminModule } from './modules/admin/admin.module';



@Module({

  imports: [

    ConfigModule.forRoot({

      isGlobal: true,

      load: [configuration],

      validationSchema: envValidationSchema,

    }),

    ThrottlerModule.forRoot({

      throttlers: [

        {

          name: LOGIN_THROTTLE.name,

          ttl: LOGIN_THROTTLE.ttl,

          limit: LOGIN_THROTTLE.limit,

        },

        {

          name: CONTACT_THROTTLE.name,

          ttl: CONTACT_THROTTLE.ttl,

          limit: CONTACT_THROTTLE.limit,

        },

      ],

    }),

    FileStorageModule,

    PrismaModule,

    HealthModule,

    AuthModule,

    SectorsModule,

    ProjectsModule,

    UploadModule,

    ContactModule,

    AdminModule,

  ],

})

export class AppModule implements NestModule {

  configure(consumer: MiddlewareConsumer): void {

    consumer.apply(HttpsRedirectMiddleware).forRoutes('*');

  }

}

