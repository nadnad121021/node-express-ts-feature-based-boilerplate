import { AppDataSource } from '@db';
import { User } from '@modules/users/user.entity';

export class UserRepository {
  private repo = AppDataSource.getRepository(User);

  findAllIncludingDeleted() {
    return this.repo.find({ });
  }

  findActiveUsers() {
    return this.repo.find({ where: { isActive: true, isDeleted: false } });
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id, isActive: true, isDeleted: false } });
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

  findAll(filter: Partial<User>) {
    return this.repo.find({ where: filter });
  }

  createQueryBuilder(alias: string) {
    return this.repo.createQueryBuilder(alias);
  }
}
