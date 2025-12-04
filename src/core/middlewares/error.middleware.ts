import type { NextFunction, Request, Response } from 'express';
import { HttpException } from '@core/exceptions/http.exception';
import  logger  from '@core/utils/logger';

export const errorMiddleware = (
  err: Error | HttpException,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const status = err instanceof HttpException ? err.status : 500;
  const message = err.message || 'Internal server error';

  if (status >= 500) {
    logger.error(`[${req.method}] ${req.url} - ${message}`, { error: err });
  } else {
    logger.warn(`[${req.method}] ${req.url} - ${message}`);
  }

  res.status(status).json({
    status,
    message,
    ...(err instanceof HttpException && err.details
      ? { details: err.details }
      : {}),
  });
};
