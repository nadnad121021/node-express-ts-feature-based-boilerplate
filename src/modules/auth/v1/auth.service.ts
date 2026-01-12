// modules/auth/services/auth.service.ts
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "@config";
import { UserRepository } from "../../users/user.repository"
import { LoginDto, RegisterDto } from "../auth.dto";
import { HttpException } from '@core/exceptions/http.exception';
import { generateAccessToken } from "@core/utils/jwt";

export class AuthService {
    constructor(private repo = new UserRepository()) { }

    async login(data: LoginDto) {
        const user = await this.repo.findByEmail(data.email);

        if (!user) {
            throw new HttpException(401, "Invalid credentials");
        }

        const valid = await bcrypt.compare(data.password, user.password);
        if (!valid) {
            throw new HttpException(401, "Invalid credentials");
        }

        const token = generateAccessToken({ userData:{ id: user.id, email: user.email } });

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        };
    }
}
