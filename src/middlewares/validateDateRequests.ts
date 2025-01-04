import { Injectable } from '@nestjs/common';
import { NextFunction } from 'express';

@Injectable()
class ValidateDateRequestsMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    next();
  }
}

export { ValidateDateRequestsMiddleware };
