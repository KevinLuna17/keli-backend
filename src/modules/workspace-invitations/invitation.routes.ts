import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import * as invitationController from "./invitation.controller";

const router = Router();

router.get("/", authMiddleware, invitationController.listInvitations);
router.post(
  "/:id/accept",
  authMiddleware,
  invitationController.acceptInvitation,
);
router.post(
  "/:id/decline",
  authMiddleware,
  invitationController.declineInvitation,
);
router.delete("/:id", authMiddleware, invitationController.cancelInvitation);

export default router;
