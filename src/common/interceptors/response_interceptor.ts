import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { instanceToPlain, plainToInstance } from 'class-transformer';

@Injectable()
export class LoggerResponseInterceptor implements NestInterceptor {
  private readonly logger = new Logger(this.constructor.name);
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map(data => {
        this.logger.log({ msg: 'Sending response', statusCode: response.statusCode, method: request.method, url: request.url, body: data });
        return data;
      })
    );
  }
}

@Injectable()
export class ApiInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      map(data => {
        if (request.skipResponseInterceptor) {
          return data;
        }
        if (!data) {
          data = {};
        }
        const responseModel = Reflect.getMetadata('ResponseModel', context.getHandler());
        if (responseModel) {
          data = plainToInstance(responseModel, data, { ignoreDecorators: true });
          data = instanceToPlain(data);
        }
        return instanceToPlain(data);
      })
    );
  }
}
