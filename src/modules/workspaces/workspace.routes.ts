import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import * as workspaceController from "./workspace.controller";

const router = Router();

router.get("/current", authMiddleware, workspaceController.getCurrentWorkspace);

export default router;
