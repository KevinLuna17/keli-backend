import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import * as analyticsController from "./analytics.controller";

const router = Router();

router.use(authMiddleware);

/**
 * Analytics API
 *
 * Base path: /api/analytics
 * All routes require authentication (Clerk).
 *
 * GET /dashboard
 *   Workspace dashboard summary for the home screen.
 *   Query: workspaceId (UUID, required)
 *   Response: 200 {
 *     data: {
 *       balanceInCents,
 *       totalIncomeInCents,
 *       totalExpensesInCents,
 *       recentTransactions: TransactionRecord[]
 *     }
 *   }
 */
router.get("/dashboard", analyticsController.getDashboard);

export default router;
