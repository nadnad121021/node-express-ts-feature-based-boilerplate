import jwt from 'jsonwebtoken';
import config from '@config';
import { AuthTokenPayload, JWTDecoded } from '@core/interfaces/auth.interface';

export function generateAccessToken(payload: { userData: AuthTokenPayload }) {
  //@ts-ignore
  return jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiresIn || '1d',
  });
}

export function generateRefreshToken(payload: { userData: AuthTokenPayload }) {
  //@ts-ignore
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn || '7d',
  });
}

export function verifyAccessToken(token: string):JWTDecoded {
  return jwt.verify(token, config.jwt.accessSecret) as JWTDecoded;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, config.jwt.refreshSecret);
}
