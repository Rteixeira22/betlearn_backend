import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';

const authorize =
  (...allowedRoles: ('user' | 'admin')[]) =>
  (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.userRole || !allowedRoles.includes(req.userRole)) {
      res.status(403).json({ message: 'Acesso não autorizado' });
      return;
    }
    next();
  };

export default authorize;


