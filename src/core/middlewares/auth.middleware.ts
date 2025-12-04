import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedException } from '@core/exceptions/http.exception';
import config  from '@config';
import { UserRepository } from "@modules/users/user.repository"
import { RequestWithPerson } from '@core/interfaces/auth.interface';

export const authMiddleware = (required = true) => {
  return async (req: RequestWithPerson, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        if (!required) return next();
        throw new UnauthorizedException('Missing authorization header');
      }

      const decoded = jwt.verify(authHeader, config.jwt.accessSecret);
      if (!decoded) {
        throw new UnauthorizedException('Invalid token');
      }
      const userRepo = new UserRepository();
      const user = await userRepo.findById((decoded as any).id);
      req.user = user;
      req.token = authHeader;

      next();
    } catch (err: any) {
      next(new UnauthorizedException('Invalid or expired token', err.message));
    }
  };
};
