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
  app.use(express.json());
  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(config.get<number>('PORT'));
}
bootstrap();
