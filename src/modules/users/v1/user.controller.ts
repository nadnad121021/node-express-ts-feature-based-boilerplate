import type { NextFunction, Request, Response } from 'express';
import { UserService } from './user.service';
import { RequestWithPerson } from '@core/interfaces/auth.interface';

export class UserController {
  constructor(private service = new UserService()) {}

  getUsers = async (req: RequestWithPerson, res: Response) => {
    const users = await this.service.getUsers();
    res.json(users);
  };

  getUser = async (req: Request, res: Response) => {
    const user = await this.service.getUser(req.params.id);
    res.json(user);
  };

  createUser = async (req: Request, res: Response) => {
    const user = await this.service.createUser(req.body);
    res.status(201).json(user);
  };

  updateUser = async (req: Request, res: Response) => {
    const user = await this.service.updateUser(req.params.id, req.body);
    res.json(user);
  };

  deleteUser = async (req: Request, res: Response) => {
    await this.service.deleteUser(req.params.id);
    res.status(204).send();
  };
}
