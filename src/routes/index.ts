import { Router } from "express";
import authRouter from "./auth/index";
import { getHealth } from "./health/health.controller";
import analyticsRouter from "../modules/analytics/analytics.routes";
import categoriesRouter from "../modules/categories/category.routes";
import transactionsRouter from "../modules/transactions/transaction.routes";
import workspacesRouter from "../modules/workspaces/workspace.routes";

const router = Router();

router.get("/health", getHealth);
router.use("/auth", authRouter);
router.use("/workspaces", workspacesRouter);
router.use("/categories", categoriesRouter);
router.use("/analytics", analyticsRouter);
router.use("/transactions", transactionsRouter);

export default router;
