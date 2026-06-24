import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../models/userRoles';

export const requireRole = (role: UserRole) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== role) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
};
