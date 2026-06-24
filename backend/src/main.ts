import { NestFactory } from '@nestjs/core';

import { ConfigService } from '@nestjs/config';

import { ValidationPipe } from '@nestjs/common';

import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

import { configureSecurity } from './config/security.config';

import { PrismaService } from './prisma/prisma.service';



async function bootstrap() {

  const app = await NestFactory.create(AppModule);



  const config = app.get(ConfigService);

  const prisma = app.get(PrismaService);



  app.use(cookieParser());

  configureSecurity(app);



  app.useGlobalPipes(

    new ValidationPipe({

      whitelist: true,

      forbidNonWhitelisted: true,

      transform: true,

    }),

  );



  app.useGlobalFilters(new AllExceptionsFilter(config));

  app.useGlobalInterceptors(new LoggingInterceptor());



  await prisma.enableShutdownHooks(app);



  const port = Number(process.env.PORT) || config.get<number>('port') || 3000;

  await app.listen(port);

}

bootstrap();

