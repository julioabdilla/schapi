import { HttpException, HttpStatus, Logger } from "@nestjs/common";

import { instanceToPlain } from 'class-transformer';
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';

export class BaseHttpException extends HttpException {
  protected exceptionName = this.constructor.name; 
  public responseModel: any;

  constructor(httpCode: HttpStatus, message: string) {
    super(message, httpCode);
    if (!this.responseModel) {
      this.responseModel = {
        error: {
          message: message,
          type: this.exceptionName,
        },
      };
    }
  }
}

@Catch(BaseHttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(this.constructor.name);
  catch(exception: BaseHttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const responseData = exception.responseModel;
    const status = exception['status'] || 500;
    const response = instanceToPlain(responseData);
    
    this.logger.error({ msg: 'Sending response err', statusCode: status, method: req.method, url: req.url, body: response });

    res
      .status(status)
      .json(response);
  }
}

export class AuthException extends BaseHttpException {
  constructor(message?: string) {
    super(HttpStatus.UNAUTHORIZED, message || 'Unauthorized');
  }
}

export class FileTooLarge extends BaseHttpException {
  constructor() {
    super(HttpStatus.BAD_REQUEST, 'File to size');
  }
}

export class UnknownException extends BaseHttpException {
  constructor() {
    super(HttpStatus.INTERNAL_SERVER_ERROR, 'Unknown error');
  }
}
