import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import { RequestWithUser } from "@core/interfaces/auth.interface";

export class AuthController {
  constructor(private authService = new AuthService()) {}

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.login(req.body);
      res.setHeader('authorization', result.token);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  me = async (req: RequestWithUser, res: Response) => {
    res.json({ success: true, user: req.user });
  };
}
