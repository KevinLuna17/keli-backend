import { Router } from "express";
import authRouter from "./auth/index";
import { getHealth } from "./health/health.controller";
import transactionsRouter from "./transactions/index";

const router = Router();

router.get("/health", getHealth);
router.use("/auth", authRouter);
router.use("/transactions", transactionsRouter);

export default router;
