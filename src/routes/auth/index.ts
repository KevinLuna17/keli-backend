import { Router } from "express";
import * as authController from "./authController";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.post('/sync', authMiddleware, authController.syncUser);

export default router;