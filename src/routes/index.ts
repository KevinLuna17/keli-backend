import { Router } from "express";
import authRouter from "./auth/index";
import { getHealth } from "./health/health.controller";
import analyticsRouter from "../modules/analytics/analytics.routes";
import transactionsRouter from "../modules/transactions/transaction.routes";

const router = Router();

router.get("/health", getHealth);
router.use("/auth", authRouter);
router.use("/analytics", analyticsRouter);
router.use("/transactions", transactionsRouter);

export default router;
