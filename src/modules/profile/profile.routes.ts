import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import * as profileController from "./profile.controller";

const router = Router();

router.get("/", authMiddleware, profileController.getProfile);
router.patch("/", authMiddleware, profileController.updateProfile);

export default router;
