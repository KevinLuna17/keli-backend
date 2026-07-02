import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import * as invitationController from "../workspace-invitations/invitation.controller";
import * as workspaceMemberController from "../workspace-members/workspace-member.controller";
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
router.get(
  "/:id/members",
  authMiddleware,
  workspaceMemberController.listWorkspaceMembers,
);
router.delete(
  "/:id/members/:memberId",
  authMiddleware,
  workspaceMemberController.removeWorkspaceMember,
);
router.patch("/:id", authMiddleware, workspaceController.updateWorkspace);
router.patch(
  "/:id/currency",
  authMiddleware,
  workspaceController.updateWorkspaceCurrency,
);
router.delete("/:id", authMiddleware, workspaceController.deleteWorkspace);

export default router;
