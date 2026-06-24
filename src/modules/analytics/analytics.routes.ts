import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import * as analyticsController from "./analytics.controller";

const router = Router();

router.use(authMiddleware);

router.get("/dashboard", analyticsController.getDashboard);
router.get("/summary", analyticsController.getSummary);
router.get("/monthly", analyticsController.getMonthly);
router.get("/expenses-by-category", analyticsController.getExpensesByCategory);
router.get("/income-by-category", analyticsController.getIncomeByCategory);

export default router;
