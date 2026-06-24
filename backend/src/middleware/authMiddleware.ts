import { Request, Response, NextFunction } from 'express';
import { UserContext } from '../models/userRoles';

declare global {
  namespace Express {
    interface Request {
      user?: UserContext;
    }
  }
}

export const mockAuthMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  req.user = {
    id: 'user-1',
    role: 'buyer',
    branchId: 'branch-1',
  };
  next();
};
