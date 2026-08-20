import { Request, Response, NextFunction } from 'express';
import logger from '../lib/logger.js';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
};

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  logger.error(
    {
      err: {
        message: err.message,
        stack: err.stack,
        name: err.name,
      },
      req: {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
      },
      statusCode,
    },
    'Request error caught in centralized handler'
  );

  res.status(statusCode).json({
    message: isProduction && statusCode === 500 ? 'Internal Server Error' : err.message || 'Internal Server Error',
    ...(isProduction ? {} : { stack: err.stack }),
  });
};
