// modules/auth/routes/auth.route.ts
import { Router } from "express";
import { AuthController } from "./auth.controller";
import { authMiddleware } from "@core/middlewares/auth.middleware";
import { validateDto } from "@core/middlewares/validate.dto";
import { LoginDto } from "../auth.dto";

const router = Router();
const controller = new AuthController();

router.post("/login", validateDto(LoginDto), controller.login);
router.get("/me", authMiddleware, controller.me);

export default router;
