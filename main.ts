import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import { AppModule } from 'src/app.module';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { LoggerResponseInterceptor } from 'src/common/interceptors/response_interceptor';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/common/filters/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const config = app.get(ConfigService);
  app.enableCors({
    origin: [...(config.get<string>("CORS_ORIGINS")?.split(',') || ['*'])],
    exposedHeaders: 'X-Total-Count, X-Current-Page, X-Total-Page, X-Per-Page',
  });
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'", "http://localhost:3000"],
      },
    },
  }));
  app.use(express.json());
  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(config.get<number>('PORT'));
}
bootstrap();
