// middleware/authenticate.ts
import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
  apiKey?: string;
  userRole?: 'user' | 'admin';
}

const requireAPIKey = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const providedKey: string | undefined =
    req.headers['x-api-key'] as string || req.query.apikey as string;

  const userKey = process.env.API_KEY_USERS;
  const adminKey = process.env.API_KEY_ADMINS;

  if (!providedKey) {
    res.status(401).json({
      error: 'API key obrigatória',
      message: 'Key da API não encontrada. Por favor, forneça uma chave de API válida.',
    });
    return;
  }

  let role: 'user' | 'admin' | null = null;


  if (providedKey === userKey) {
    role = 'user';
  } else if (providedKey === adminKey) {
    role = 'admin';
  }

  if (!role) {
    res.status(403).json({ error: 'Key da API inválida' });
    return;
  }

  req.apiKey = providedKey;
  req.userRole = role;


  next();
};

export { requireAPIKey, AuthenticatedRequest };
