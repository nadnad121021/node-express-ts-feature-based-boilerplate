import type { NextFunction, Request, Response } from 'express';
import { UserService } from './user.service';
import { RequestWithUser } from '@modules/auth/auth.interface';
import { IGetUsersFilterQuery } from '@modules/users/user.interface';
import { TSortOrder } from '@core/enums/common.enum';

export class UserController {
  constructor(private service = new UserService()) { }

  getUsers = async (req: RequestWithUser, res: Response) => {
    const { skip, limit, sortBy, sortOrder, searchKey } = req.query;
    const queryParams: IGetUsersFilterQuery = {
      skip: skip ? parseInt(skip as string, 10) : 0,
      limit: limit ? parseInt(limit as string, 10) : 0,
      sortBy: sortBy as string,
      sortOrder: sortOrder as TSortOrder,
      searchKey: searchKey as string
    };

    const users = await this.service.getUsersByFilter(queryParams);
    res.json(users);
  };

  getUser = async (req: Request, res: Response) => {
    const user = await this.service.getUser((req as any).params.id);
    res.json(user);
  };

  createUser = async (req: Request, res: Response) => {
    const user = await this.service.createUser(req.body);
    res.status(201).json(user);
  };

  updateUser = async (req: Request, res: Response) => {
    const user = await this.service.updateUser((req as any).params.id, req.body);
    res.json(user);
  };

  deleteUser = async (req: RequestWithUser, res: Response) => {
    const result = await this.service.softDeleteUser((req as any).params.id, req.user?.id || 'system');
    res.json(result);
  };
}
