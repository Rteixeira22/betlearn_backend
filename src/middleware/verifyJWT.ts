import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  userId?: string;
  userRole?: 'user' | 'admin';
  adminId?: string;
}

export function verifyJWT(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    res.status(401).json({ error: 'Token não enviado' });
    return;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'Token mal formado' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    req.userId = decoded.userId;
    req.adminId = decoded.adminId; 
    req.userRole = decoded.role;

    next();
  } catch (err) {
    res.status(403).json({ error: 'Token inválido ou expirado' });
    return;
  }
}
