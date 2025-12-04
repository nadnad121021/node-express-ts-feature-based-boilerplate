import { Router } from 'express';
import { UserController } from './user.controller';
import { validateDto } from '@core/middlewares/validate.dto';
import { authMiddleware } from '@core/middlewares/auth.middleware';
import { CreateUserDto, UpdateUserDto } from '../user.dto';

const router:any = Router();
const controller = new UserController();

// Protected routes
router.get('/',authMiddleware(), controller.getUsers);
router.get('/:id',authMiddleware(), controller.getUser);
router.post('/', authMiddleware(), validateDto(CreateUserDto), controller.createUser);
router.put('/:id', authMiddleware(), validateDto(UpdateUserDto, true), controller.updateUser);
router.delete('/:id', authMiddleware(), controller.deleteUser);
export default router;
