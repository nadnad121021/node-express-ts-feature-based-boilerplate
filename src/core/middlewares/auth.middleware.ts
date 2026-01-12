import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedException } from '@core/exceptions/http.exception';
import config  from '@config';
import { UserRepository } from "@modules/users/user.repository"
import { RequestWithUser } from '@core/interfaces/auth.interface';
import { verifyAccessToken } from '@core/utils/jwt';

export const authMiddleware = (required = true) => {
  return async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        if (!required) return next();
        throw new UnauthorizedException('Missing authorization header');
      }

      const decoded = verifyAccessToken(authHeader);
      if (!decoded) {
        throw new UnauthorizedException('Invalid token');
      }
      if(!decoded.userData || !decoded.userData.id){
        throw new UnauthorizedException('Invalid token data');
      }
      const userRepo = new UserRepository();
      const user = await userRepo.findById(decoded.userData.id);
      req.user = user;
      req.token = authHeader;

      next();
    } catch (err: any) {
      next(new UnauthorizedException('Invalid or expired token', err.message));
    }
  };
};
