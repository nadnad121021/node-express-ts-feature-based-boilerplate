import e, { Request } from 'express';
import { User } from '@modules/users/user.entity';

export interface RequestWithUser extends Request {
    user?: User | null;
    token?: string;
}
export interface AuthTokenPayload {
    id: string;
    email: string;
}
export interface JWTDecoded {
    userData: AuthTokenPayload;
    iat: number;
    exp: number;
}