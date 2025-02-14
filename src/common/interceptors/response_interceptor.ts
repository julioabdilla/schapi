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
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map(data => {
        if (request.skipResponseInterceptor) {
          return data;
        }
        if (!data) {
          data = {};
        }
        if (request.pagination) {
          response.set('X-Total-Count', request.pagination.totalData);
          response.set('X-Current-Page', request.pagination.page);
          response.set('X-Total-Page', Math.ceil(request.pagination.totalData / request.pagination.perpage));
          response.set('X-Per-Page', request.pagination.perpage);
        }
        const responsedto = Reflect.getMetadata('UseResponseDto', context.getHandler());
        if (responsedto) {
          data = plainToInstance(responsedto, data, { ignoreDecorators: true });
          data = instanceToPlain(data);
        }
        return instanceToPlain(data);
      })
    );
  }
}
