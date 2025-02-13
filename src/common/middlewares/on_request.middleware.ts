import { Response, NextFunction } from 'express';
import * as moment from 'moment';
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

@Injectable()
export class OnRequestMiddleware implements NestMiddleware {
  private readonly logger = new Logger(this.constructor.name);
  async use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(`[${moment().format()}] Incoming request ${req.method} ${req.url}, headers=${JSON.stringify(req.headers)}, body=${JSON.stringify(req.body)}`);
    next();
  }
}
