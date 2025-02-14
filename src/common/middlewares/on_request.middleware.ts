import { Response, NextFunction } from 'express';
import * as moment from 'moment';
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

@Injectable()
export class OnRequestMiddleware implements NestMiddleware {
  private readonly logger = new Logger(this.constructor.name);
  async use(req: any, res: Response, next: NextFunction) {
    this.logger.log(`[${moment().format()}] Incoming request ${req.method} ${req.url}, headers=${JSON.stringify(req.headers)}, body=${JSON.stringify(req.body)}`);
    req.pagination = {};
    if (req.query.page) {
      req.pagination.page = Number(req.query.page); 
    }
    if (req.query.perpage) {
      req.pagination.perpage = Number(req.query.perpage); 
    }
    next();
  }
}
