import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import { AppModule } from 'src/app.module';
import { ConfigService } from '@nestjs/config';
import { LoggerResponseInterceptor } from '@/common/interceptors/response.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/common/filters/exception.filter';
import { Logger } from '@/common/logger/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const config = app.get(ConfigService);
  const logger = app.get(Logger);
  app.useLogger(logger);
  app.enableCors({
    // origin: [...(config.get<string>("CORS_ORIGINS")?.split(',') || ['*'])],
    exposedHeaders: 'X-Total-Count, X-Current-Page, X-Total-Page, X-Per-Page',
  });
  // app.use(helmet({
  //   contentSecurityPolicy: {
  //     directives: {
  //       defaultSrc: ["'self'"],
  //       scriptSrc: ["'self'", "'unsafe-inline'"],
  //       styleSrc: ["'self'", "'unsafe-inline'"],
  //       imgSrc: ["'self'", "data:"],
  //       connectSrc: ["'self'", "http://localhost:3000"],
  //     },
  //   },
  // }));
  app.use(express.json({ limit: '50mb' }));
  app.useGlobalInterceptors(new LoggerResponseInterceptor(logger));
  app.useGlobalFilters(new HttpExceptionFilter);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(config.get<number>('PORT'));
}
bootstrap();
