import { Request, Response, NextFunction } from 'express';
import { logger } from '../services/logger.service';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  // Response bittiğinde log kaydet
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    logger.http(req.method, req.originalUrl, res.statusCode, responseTime);
  });

  next();
};
