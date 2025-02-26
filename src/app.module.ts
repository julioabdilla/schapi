import { v4 as uuid } from 'uuid';

import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

import { CacheModule } from 'src/cache';
import { LoggerModule as CustomLoggerModule } from 'src/common/logger/logger.module';
import { OnRequestMiddleware } from 'src/common/middlewares/on_request.middleware';
import { DatabaseModule } from 'src/database';
import { UserModule } from './modules/user/user.module';
import { ArticleModule } from './modules/article/article.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GalleryModule } from './modules/gallery/gallery.module';
import { StaffModule } from './modules/staff/staff.module';
import { AuthModule } from './modules/auth/auth.module';
import { MediaModule } from './modules/media/media.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      expandVariables: true,
    }),
    CustomLoggerModule,
    LoggerModule.forRoot({
      pinoHttp: {
        redact: {
          paths: ['api_key', 'token', 'key', 'req.headers.authorization', 'password', 'authorization', 'signature', 'Authorization'],
          censor: '[***secret***]',
        },
        genReqId: (req: any) => {
          return req.headers.req_id || uuid();
        },
        autoLogging: false,
      },
    }),
    DatabaseModule,
    CacheModule,

    //API Module
    ArticleModule,
    AuthModule,
    GalleryModule,
    MediaModule,
    StaffModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(OnRequestMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
