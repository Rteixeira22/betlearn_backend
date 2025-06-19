import { Request, Response, NextFunction } from 'express';

// Extend Request interface para incluir isSwaggerRequest
declare global {
  namespace Express {
    interface Request {
      isSwaggerRequest?: boolean;
    }
  }
}

export const swaggerBypass = (req: Request, res: Response, next: NextFunction): void => {
  const userAgent = req.get('User-Agent');
  const referer = req.get('Referer');

  // Detecta se a requisição vem do Swagger UI
  if (userAgent?.includes('swagger-ui') || 
      referer?.includes('/api-docs') || 
      req.get('X-Swagger-Request') === 'true') {
    
    // Marca a requisição como vinda do Swagger
    req.isSwaggerRequest = true;
    
    // Adiciona headers necessárias automaticamente
    req.headers['apikey'] = process.env.API_KEY || 'swagger-bypass';
    req.headers['Authorization'] = `Bearer ${process.env.ADMIN_JWT_TOKEN || 'swagger-bypass'}`;
  }
  
  next();
};


