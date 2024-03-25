import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Your authentication logic here (e.g., check for token in headers)
    console.log(req.headers.authorization, 'authorization');
    next();
  }
}
