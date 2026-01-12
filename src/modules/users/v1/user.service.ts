import bcrypt from 'bcrypt';
import { UserRepository } from '../user.repository';
import { AppDataSource } from '../../../db/data-source';
import { CreateUserDto, UpdateUserDto } from '../user.dto';
import { HttpException } from '@core/exceptions/http.exception';
import { User } from '../user.entity';
import { cacheDel, cacheGet, cacheSet } from '@core/utils/cache';
import config from '@config';
import { IGetUsersFilterQuery } from '@core/interfaces/user.interface';

export class UserService {
  constructor(private repo = new UserRepository()) { }

  async getUsers(params: IGetUsersFilterQuery) {
    const { skip, limit, sortBy, sortOrder, searchKey } = params;

    return this.repo.findAll({});
  }

  async getUsersByFilter(params: IGetUsersFilterQuery) {
    const {
      skip = 0,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      searchKey,
    } = params;

    const qb = this.repo.createQueryBuilder('user');

    // 🔒 Soft delete filter (always)
    qb.where('user.isDeleted = false');

    // 🔍 Search (MySQL + PostgreSQL compatible)
    if (searchKey) {
      const isPostgres = AppDataSource.options.type === 'postgres';
      const operator = isPostgres ? 'ILIKE' : 'LIKE';

      qb.andWhere(
        `(user.name ${operator} :search OR user.email ${operator} :search)`,
        { search: `%${searchKey}%` },
      );
    }

    // 🔃 Safe sorting
    const allowedSortFields = ['createdAt', 'name', 'email'];
    const orderBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : 'createdAt';

    qb.orderBy(
      `user.${orderBy}`,
      sortOrder === 'ASC' ? 'ASC' : 'DESC',
    );

    // 📄 Pagination
    if (limit > 0) {
      qb.skip(skip).take(limit);
    }

    const [users, total] = await qb.getManyAndCount();

    return {
      data: users,
      meta: { 
        total, 
        skip, 
        limit: limit > 0 ? limit : total, // show actual count if fetching all
      },
    };

  }
  
  async getUser(id: string) {
    if (config.enableCache) {
      // Check cache first
      const cachedUser = await cacheGet(`user_${id}`);
      if (cachedUser) {
        return cachedUser;
      }
    }
    const user = await this.repo.findById(id);
    if (!user) throw new HttpException(404, 'User not found');
    if (config.enableCache) {
      await cacheSet(`user_${id}`, user, 3600); // Cache for 1 hour
    }
    return user;
  }

  async createUser(body: CreateUserDto) {
    return AppDataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);

      const exists = await userRepo.findOne({
        where: { email: body.email.toLowerCase() },
      });

      if (exists && !exists.isDeleted) {
        throw new HttpException(400, 'Email already exists');
      }

      if (exists && exists.isDeleted) {
        // Restore deleted user
        exists.isDeleted = false;
        exists.deletedAt = undefined;
        exists.deletedBy = undefined;
        exists.isActive = true;
        const restoredUser = userRepo.merge(exists, body);
        if (config.enableCache) {
          await cacheDel(`user_${exists.id}`); // Clear cache
        }
        return await userRepo.save(restoredUser);
      }

      const hashed = await bcrypt.hash(body.password, 10);

      const user = userRepo.create({
        ...body,
        email: body.email.toLowerCase(),
        password: hashed,
      });

      return await userRepo.save(user);
    });
  }


  async updateUser(id: string, body: UpdateUserDto) {
    return AppDataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);

      const user = await userRepo.findOne({ where: { id } });
      if (!user) {
        throw new HttpException(404, 'User not found');
      }

      if (body.password) {
        body.password = await bcrypt.hash(body.password, 10);
      }

      const updated = userRepo.merge(user, body);
      const savedUser = await userRepo.save(updated);
      // Invalidate cache
      if (config.enableCache) {
        await cacheDel(`user_${id}`); // Update cache
      }
      return savedUser
    });
  }


  async deleteUser(id: string) {
    await this.getUser(id);
    const result = await this.repo.delete(id);
    if (config.enableCache) {
      await cacheDel(`user_${id}`);
    }
    return result;
  }

  async hardDeleteUser(id: string) {
    return AppDataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);
      const user = await userRepo.findOne({ where: { id } });
      if (!user) {
        throw new HttpException(404, 'User not found');
      }
      await userRepo.remove(user);
      if (config.enableCache) {
        await cacheDel(`user_${id}`);
      }
      return;
    });
  }

  async softDeleteUser(id: string, deletedBy: string) {
    return AppDataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);
      const user = await userRepo.findOne({ where: { id } });
      if (!user) {
        throw new HttpException(404, 'User not found');
      }
      user.isDeleted = true;
      user.deletedAt = new Date();
      user.deletedBy = deletedBy;
      user.isActive = false;
      await userRepo.save(user);
      if (config.enableCache) {
        await cacheDel(`user_${id}`);
      }
      return user;
    });
  }
}
