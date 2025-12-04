import bcrypt from 'bcrypt';
import { UserRepository } from '../user.repository';
import { CreateUserDto, UpdateUserDto } from '../user.dto';
import { HttpException } from '@core/exceptions/http.exception';

export class UserService {
  constructor(private repo = new UserRepository()) {}

  async getUsers() {
    return this.repo.findAll();
  }

  async getUser(id: string) {
    const user = await this.repo.findById(id);
    if (!user) throw new HttpException(404, 'User not found');
    return user;
  }

  async createUser(body: CreateUserDto) {
    const exists = await this.repo.findByEmail(body.email);
    if (exists) throw new HttpException(400, 'Email already exists');

    const hashed = await bcrypt.hash(body.password, 10);
    return this.repo.create({ ...body, password: hashed });
  }

  async updateUser(id: string, body: UpdateUserDto) {
    await this.getUser(id);

    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10);
    }

    await this.repo.update(id, body as any);
    return this.getUser(id);
  }

  async deleteUser(id: string) {
    await this.getUser(id);
    return this.repo.delete(id);
  }
}
