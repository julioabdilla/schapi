import { Response, NextFunction } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Logger } from '../logger/logger';

@Injectable()
export class OnRequestMiddleware implements NestMiddleware {
  // private readonly logger = new Logger(this.constructor.name);
  constructor(
    private readonly logger: Logger
  ) {}

  async use(req: any, res: Response, next: NextFunction) {
    this.logger.log(`Incoming request ${req.method} ${req.url}, headers=${JSON.stringify(req.headers)}, body=${JSON.stringify(req.body)}`);
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
