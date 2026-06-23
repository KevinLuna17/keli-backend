import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import * as invitationController from "../workspace-invitations/invitation.controller";
import * as workspaceController from "./workspace.controller";

const router = Router();

router.get("/", authMiddleware, workspaceController.listWorkspaces);
router.get("/current", authMiddleware, workspaceController.getCurrentWorkspace);
router.post("/", authMiddleware, workspaceController.createWorkspace);
router.post(
  "/:id/invitations",
  authMiddleware,
  invitationController.createWorkspaceInvitation,
);
router.patch("/:id", authMiddleware, workspaceController.updateWorkspace);
router.delete("/:id", authMiddleware, workspaceController.deleteWorkspace);

export default router;
