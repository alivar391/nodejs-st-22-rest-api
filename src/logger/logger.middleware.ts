import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { path, method } = req;
    console.log('\x1b[35m', 'REQUEST', req);
    console.log('\x1b[35m', 'RESPONSE', res);
    console.log('\x1b[36m', `PATH: ${path}, METHOD: ${method}`);
    console.log('\x1b[37m');
    next();
  }
}
