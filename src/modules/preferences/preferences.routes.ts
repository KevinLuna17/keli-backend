import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import * as preferencesController from "./preferences.controller";

const router = Router();

router.get("/", authMiddleware, preferencesController.getPreferences);
router.patch("/", authMiddleware, preferencesController.updatePreferences);

export default router;
