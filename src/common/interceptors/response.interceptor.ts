import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Logger } from '../logger/logger';

@Injectable()
export class LoggerResponseInterceptor implements NestInterceptor {
  // private readonly logger = new Logger(this.constructor.name);
  constructor(private readonly logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map(data => {
        this.logger.log(`Sending response ${request.method} ${request.url}:${response.statusCode}, body=${JSON.stringify(data)}`);
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
