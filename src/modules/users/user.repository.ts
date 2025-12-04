import { AppDataSource } from '@db';
import { User } from '@modules/users/user.entity';

export class UserRepository {
  private repo = AppDataSource.getRepository(User);

  findAll() {
    return this.repo.find();
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  findByEmail(email: string) {
    return this.repo.findOneBy({ email });
  }

  create(data: Partial<User>) {
    const user = this.repo.create(data as User);
    return this.repo.save(user);
  }

  update(id: string, data: Partial<User>) {
    return this.repo.update({ id }, data);
  }

  delete(id: string) {
    return this.repo.delete({ id });
  }
}
