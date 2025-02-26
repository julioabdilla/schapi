import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as express from 'express';

@Injectable()
export class JsonLimitInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<express.Request>();
    const response = ctx.getResponse<express.Response>();

    express.json({ limit: '10mb' })(request, response, (err) => {
      if (err) {
        throw err;
      }
    });

    return next.handle();
  }
}