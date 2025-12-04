import { Request } from 'express';
import { User } from '@modules/users/user.entity';

export interface RequestWithPerson extends Request {
    user?: User | null;
    token?: string;
}